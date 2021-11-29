import {Log} from 'models';
import {NextFunction, Response} from 'express';
import {baseQueryListValidation, validate} from 'validations/common';
import * as Joi from 'joi';

const TAG = 'validations.master_data';

export async function getAllRegions(req: any, res: Response, next: NextFunction) {
    try {
        let schema = baseQueryListValidation();
        schema = schema.append({
            propertyTypeId: Joi.string().allow('', null)
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'getAllRegions()', error);
        next(error);
    }
}
