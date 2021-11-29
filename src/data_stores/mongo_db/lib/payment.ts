import {IUserSession, Log} from 'models';
import Payment from '../db_models/payment';
import {IPayment} from 'src/models/lib/payment';
import {STATUS_LIST} from 'constants/master_data';
import {findAllRecords, findOne, findOneAndUpdate} from 'data_stores/mongo_db/helpers/query';

const TAG = 'data_stores.mongo_db.lib.payment';

export async function savePaymentOrder(loggedInUser: IUserSession, order: IPayment) {
    try {
        const payment = new Payment({
            property_request_id: order.propertyRequestId,
            amount: order.amount,
            rp_order_id: order.rpOrderId,
            user_id: loggedInUser?.userId,
            c_dt: new Date(),
            m_dt: new Date(),
            status: STATUS_LIST['5'].id,
        });
        return await payment.save();
    } catch (error) {
        Log.error(TAG, 'savePaymentOrder()', error);
        throw error;
    }
}

export async function updatePaymentOrder(loggedInUser: IUserSession, order: IPayment) {
    try {
        return await findOneAndUpdate(Payment, {
            rp_order_id: order.rpOrderId,
        }, {
            transaction_id: order.transactionId,
            rp_sign: order.rpSignature,
            payment_method: order.paymentMethod,
            m_dt: new Date(),
            status: order.status.id,
        });
    } catch (error) {
        Log.error(TAG, 'updatePaymentOrder()', error);
        throw error;
    }
}

export async function findPropertyIdByOrderId(orderId: string) {
    try {
        const result = await findOne(Payment, {
            rp_order_id: orderId,
        }, {
            property_request_id: 1,
            status: 1,
            amount: 1
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'findPropertyIdByOrderId()', error);
        throw error;
    }
}

export async function findLatestOrderByPropertyRequest(propertyRequestId: string) {
    try {
        const result = await findAllRecords(Payment, {
            property_request_id: propertyRequestId,
        }, {
            property_request_id: 1,
            status: 1,
            amount: 1,
            _id: 0,
        }, {
            $sort: {
                c_dt: -1,
            },
            limit: 1,
        });
        return result?.[0];
    } catch (error) {
        Log.error(TAG, 'findLatestOrderByPropertyRequest()', error);
        throw error;
    }
}
