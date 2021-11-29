import {NextFunction, Response} from 'express';
import {Log} from 'models';
import * as Joi from 'joi';
import {buildErrorMessage} from 'utils/string';
import {ErrorMessages} from 'constants/error_constants';
import {validate} from 'validations/common';

const TAG = 'validations.payment';

export async function createPaymentOrder(req: any, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object().keys({
            propertyRequestId: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID',
                    })
                }),
            paymentMethod: Joi.string().allow('', null)
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'createPaymentOrder()', error);
        next(error);
    }
}
export async function capturePayment(req: any, res: Response, next: NextFunction) {
    try {
        const schema = Joi.object().keys({
            rpOrderId: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Order ID',
                    })
                }),
            rpPaymentId: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Payment ID',
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'createPaymentOrder()', error);
        next(error);
    }
}
