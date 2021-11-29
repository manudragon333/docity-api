import {IServiceResponse, Log} from 'models';
import {NextFunction, Response} from 'express';
import {PathParams} from 'constants/api_params';
import * as PaymentService from 'services/payment';
import {responseBuilder} from 'helpers/response_builder';

const TAG = 'controllers.payment';

export async function createPaymentOrder(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('REQUEST BODY: ', req.body);
        const serviceResponse: IServiceResponse = await PaymentService.createPaymentOrder(req.userSession, req.body);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'createPaymentOrder()', error);
        next(error);
    }
}

export async function updatePaymentOrder(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('REQUEST BODY: ', req.body);
        Log.debug('REQUEST HEADERS', req.headers);
        const signature = req.headers['x-razorpay-signature'];
        const serviceResponse: IServiceResponse = await PaymentService.upgradePayment(req.body,
            signature);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'updatePaymentOrder()', error);
        next(error);
    }
}

export async function getPropertyRequestLastPaymentRecord(req: any, res: Response, next: NextFunction) {
    try {
        const propertyId = req.params[PathParams.PROPERTY_REQUEST_ID];
        Log.debug('REQUEST HEADERS', req.headers);
        const serviceResponse: IServiceResponse = await PaymentService.getPropertyRequestLastPaymentRecord(propertyId);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'updatePaymentOrder()', error);
        next(error);
    }
}
export async function capturePayment(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('REQUEST BODY: ', req.body);
        Log.debug('REQUEST HEADERS', req.headers);
        const serviceResponse: IServiceResponse = await PaymentService.capturePayment(req.body);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'capturePayment()', error);
        next(error);
    }
}
