import {
    APIError,
    BaseRecord,
    EmailRecipient,
    EmailSender,
    IPropertyRequest,
    IServiceResponse,
    IUserSession,
    Log,
    ServiceResponse
} from 'models';
import {HttpStatusCodes} from 'constants/status_codes';
import {razorPayClientLoader} from 'loaders/razor_pay';
import {PAYMENT_AMOUNT, STATUS_LIST} from 'constants/master_data';
import {IPayment, Payment} from 'src/models/lib/payment';
import {PaymentData} from 'data_stores/mongo_db';
import {RAZOR_PAY_CREDS, SENDER_EMAIL_ID} from 'loaders/config';
import RazorPay from 'razorpay';
import {ErrorCodes, ErrorMessages} from 'constants/error_constants';
import {
    getPropertyRequestById,
    updatePropertyRequestPaymentStatusAndStatus,
} from 'data_stores/mongo_db/lib/property_request';
import {loadTemplates} from 'loaders/template';
import {convertDateToYYYDDMM} from 'utils/date';
import {sendEmail} from 'helpers/email';

const TAG = 'services.payment';

export async function createPaymentOrder(loggedInUser: IUserSession, payload: any): Promise<IServiceResponse> {
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully created payment order request.', false);
    try {
        const {
            propertyRequestId,
            paymentMethod,
        } = payload;
        const razorPayClient = razorPayClientLoader();
        const paymentAmtInRupees = PAYMENT_AMOUNT;
        Log.debug('PAYMENT AMOUNT');
        const orderBody = {
            amount: paymentAmtInRupees * 100,
            currency: 'INR',
            receipt: 'R_' + Date.parse(new Date().toISOString()) + loggedInUser.userId,
            notes: {
                u_id: loggedInUser?.userId,
                p_id: propertyRequestId,
            },
        };
        Log.debug(`Options: ${JSON.stringify(orderBody)}`);
        const response = await razorPayClient.orders.create(orderBody);
        const payment: IPayment = new Payment(
            propertyRequestId,
            paymentAmtInRupees,
            null,
            null,
            response.id,
            paymentMethod ?? null,
            new BaseRecord(String(STATUS_LIST['5'].id)),
            loggedInUser.userId,
        );
        await PaymentData.savePaymentOrder(loggedInUser, payment);
        serviceResponse.data = response;
    } catch (error) {
        Log.error(TAG, 'createPaymentOrder()', error);
        serviceResponse.addServerError('Failed to create order due to technical difficulties');
    }
    return serviceResponse;
}

export async function verifySignature(receivedSign: string, body: any): Promise<boolean> {
    try {
        return await RazorPay.validateWebhookSignature(JSON.stringify(body),
            receivedSign, RAZOR_PAY_CREDS.WEB_HOOK_SECRET);
    } catch (error) {
        Log.error(TAG, 'verifySignature()', error);
        throw error;
    }
}

export async function sendReceiptMail(propertyRequestId: string,
                                      orderId: string,
                                      createdDate: Date,
                                      amount: number) {
    try {
        const propertyRequest: IPropertyRequest = await getPropertyRequestById(propertyRequestId);
        const templates = loadTemplates();
        const receiptTemplate = templates.PAYMENT_RECIEPT;
        const mailBody = receiptTemplate({
            orderId: propertyRequest.referenceId,
            createdDate: convertDateToYYYDDMM(propertyRequest.auditInfo.creationTime),
            amount: amount,
            address: propertyRequest.address,
        });
        sendEmail(new EmailSender(SENDER_EMAIL_ID),
            new EmailRecipient([propertyRequest.emailId]), 'PAYMENT INVOICE', mailBody)
            .catch((error) => {
                Log.error(TAG, 'sendEmail()', error);
            });
    } catch (error) {
        Log.error(TAG, 'verifySignature()', error);
        throw error;
    }
}

export async function upgradePayment(payload: any, signature: string) {
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully created payment order request.', false);
    try {
        const isValidRequest: boolean = await verifySignature(signature, payload);
        if (isValidRequest && payload) {
            const {
                payload: {
                    payment: {
                        entity
                    }
                }
            } = payload;
            const paymentOrder = await PaymentData.findPropertyIdByOrderId(entity.order_id);
            if (paymentOrder && paymentOrder.status != STATUS_LIST['8'].id) {
                const status = new BaseRecord(String(STATUS_LIST['5'].id), STATUS_LIST['5'].name);
                let propertyStatus = STATUS_LIST['0'].id;
                let paymentStatus = STATUS_LIST['4'].id;
                switch (entity.status) {
                    case 'captured':
                        status.id = String(STATUS_LIST['8'].id);
                        propertyStatus = STATUS_LIST['2'].id;
                        paymentStatus = STATUS_LIST['8'].id;
                        break;
                    case 'failed':
                        status.id = String(STATUS_LIST['9'].id);
                        propertyStatus = STATUS_LIST['0'].id;
                        paymentStatus = STATUS_LIST['4'].id;
                        break;
                }
                const payment = new Payment(
                    paymentOrder.property_request_id,
                    entity.amount / 100,
                    entity.id,
                    signature,
                    entity.order_id,
                    entity.method,
                    status,
                );
                await PaymentData.updatePaymentOrder({} as IUserSession, payment);
                await updatePropertyRequestPaymentStatusAndStatus(paymentOrder.property_request_id, +paymentStatus,
                    +propertyStatus);
                if (entity.status.toLowerCase() === 'captured') {
                    sendReceiptMail(paymentOrder.property_request_id, entity.order_id, new Date(entity.created_at),
                        entity.amount / 100)
                        .then(() => {
                            Log.info('Successfully sent receipt to user');
                        })
                        .catch((error) => {
                            Log.error(TAG, 'sendReceiptMail()', error);
                        });
                }
            }
        } else {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'Access Forbidden.';
            serviceResponse.addError(new APIError('Unauthorized request', ErrorCodes.UNAUTHORIZED,
                'signature'));
        }
    } catch (error) {
        Log.error(TAG, 'createPaymentOrder()', error);
        throw error;
    }
    return serviceResponse;
}

export async function getPropertyRequestLastPaymentRecord(propertyRequestId: string) {
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully fetched payment order request.', false);
    try {
        const result = await PaymentData.findLatestOrderByPropertyRequest(propertyRequestId);
        if (result) {
            result.status = new BaseRecord(STATUS_LIST[result.status].id, STATUS_LIST[result.status].name);
        }
        serviceResponse.data = result;
    } catch (error) {
        Log.error(TAG, 'createPaymentOrder()', error);
        serviceResponse.addServerError('Failed to fetch payment order details due to technical difficulties');
    }
    return serviceResponse;
}

export async function capturePayment(payload: any) {
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Payment is successful', false);
    try {

        const razorPayClient = razorPayClientLoader();
        Log.debug(`Options: ${JSON.stringify(payload)}`);
        //TODO: Get amount from DB using orderId from payload
        let paymentOrder0 = null;
        try {
            paymentOrder0 = await PaymentData.findPropertyIdByOrderId(payload?.rpOrderId);
        } catch ( e ) {
            Log.info('error in getting Order Id:' + payload?.rpOrderId, e);
        }
        if ( !paymentOrder0 ) {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'Invalid Order Id';
            serviceResponse.addError(new APIError(ErrorMessages.INVALID_FIELD, ErrorCodes.PAYMENT_FAILED, 'rpOrderId'));
        } else {
            const amountInPaise = paymentOrder0.amount * 100;
            Log.debug('PAYMENT AMOUNT in Paise:' + amountInPaise);
            try {
                const response = await razorPayClient.payments.capture(payload?.rpPaymentId, amountInPaise, 'INR');
                Log.debug(`response: ${JSON.stringify(response)}`);
                //TODO: Update the record status in DB to captured/successful
                const paymentOrder = await PaymentData.findPropertyIdByOrderId(payload?.rpOrderId);
                if (paymentOrder && paymentOrder.status != STATUS_LIST['8'].id) {
                    const status = new BaseRecord(String(STATUS_LIST['5'].id), STATUS_LIST['5'].name);
                    let propertyStatus = STATUS_LIST['0'].id;
                    let paymentStatus = STATUS_LIST['4'].id;
                    switch (response.status) {
                        case 'captured':
                            status.id = String(STATUS_LIST['8'].id);
                            propertyStatus = STATUS_LIST['2'].id;
                            paymentStatus = STATUS_LIST['8'].id;
                            break;
                        case 'failed':
                            status.id = String(STATUS_LIST['9'].id);
                            propertyStatus = STATUS_LIST['0'].id;
                            paymentStatus = STATUS_LIST['4'].id;
                            break;
                    }
                    const payment = new Payment(
                        paymentOrder.property_request_id,
                        response.amount / 100,
                        response.id,
                        '',
                        response.order_id,
                        response.method,
                        status,
                    );
                    await PaymentData.updatePaymentOrder({} as IUserSession, payment);
                    await updatePropertyRequestPaymentStatusAndStatus(paymentOrder.property_request_id, +paymentStatus,
                        +propertyStatus);
                    if (response.status.toLowerCase() === 'captured') {
                        sendReceiptMail(paymentOrder.property_request_id, response.order_id, new Date(response.created_at),
                            response.amount / 100)
                            .then(() => {
                                Log.info('Successfully sent receipt to user');
                            })
                            .catch((error) => {
                                Log.error(TAG, 'sendReceiptMail()', error);
                            });
                    }
                }
            } catch (rpError) {
                Log.debug('RP Capture error:', rpError);
                serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
                serviceResponse.message = 'Payment Capture failed';
                serviceResponse.addError(new APIError(ErrorMessages.PAYMENT_CAPTURE_FAILED, ErrorCodes.PAYMENT_FAILED));
            }
        }

    } catch (error) {
        Log.debug(`error: ${JSON.stringify(error)}`);
        Log.error(TAG, 'capturePayment()', error);
        throw error;
    }
    return serviceResponse;
}
