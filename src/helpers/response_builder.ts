import {NextFunction, Request, Response} from 'express';
import {isArray, isEmpty, isObject, transform} from 'lodash';
import {IServiceResponse, Log} from 'models';
import * as nodeUtil from 'util';

const TAG = 'helpers.response_builder';

export function cleanResponseData(responseData: any) {
    try {
        function nestedDataClean(nestedObject) {
            return transform(nestedObject, (result, value, key) => {
                const isCollection = isObject(value);
                const cleaned = isCollection ? nestedDataClean(value) : value;

                if (isCollection && isEmpty(cleaned)) {
                    return;
                } else if (typeof value === 'undefined' || value === null) {
                    return;
                }

                isArray(result) ? result.push(cleaned) : (result[key] = cleaned);
            });
        }

        return isObject(responseData) ? nestedDataClean(responseData) : responseData;
    } catch (error) {
        Log.error(TAG, 'cleanResponseData()', error);
        throw error;
    }
}

export function responseBuilder(serviceResponse: IServiceResponse, res: Response, next?: NextFunction, req?: Request)
    : void {
    Log.info('helper.response_builder.responseBuilder(');
    try {
        // Log.debug(`serviceResponse: ${nodeUtil.inspect(serviceResponse, false, 5)}`);
        res.set('message', serviceResponse.message);
        if (req?.method === 'GET') {
            res.set('showMessage', String(false));
        } else {
            res.set('showMessage', String(serviceResponse.showMessage));
        }
        if (serviceResponse?.errors?.length) {
            res.status(serviceResponse.statusCode || 400)
                .send({errors: serviceResponse.errors});
        } else {
            res.status(serviceResponse.statusCode || (req?.method === 'POST' ? 201 : 200))
                .send(serviceResponse.data);
        }
    } catch (error) {
        Log.error(TAG, 'responseBuilder()', error);
        next(error);
    }
}
