import {NextFunction, Response} from 'express';
import {Log} from 'models';
import * as Joi from 'joi';
import {ErrorMessages} from 'constants/error_constants';
import {buildErrorMessage} from 'utils/string';
import {baseQueryListValidation, mobileNumberValidation, validate} from 'validations/common';
import {userSchema} from 'validations/user';
import {USER_DOC_TYPES} from 'constants/master_data';

const TAG = 'validations.user';

export function doNothing(req: any, res: Response, next: NextFunction) {
    next();
}

export async function updateMyProfileDetails(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.updateMyUserProfile()');
    try {
        Log.debug('STARTED validation of update my profile.');
        const schema = userSchema();
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updateMyUserProfile()', error);
        next(error);
    }
}

export async function updateMyProfilePassword(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.updateMyUserProfile()');
    try {
        Log.debug('STARTED validation of update my profile password.');
        const schema = Joi.object().keys({
            oldPassword: Joi.string()
                .required()
                .min(6)
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Old password'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'Old password',
                        $length: '6'
                    }),
                }),
            newPassword: Joi.string()
                .required()
                .min(6)
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'New password'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'New Password',
                        $length: '6'
                    }),
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updateMyProfilePassword()', error);
        next(error);
    }
}

export async function updateMyProfileImage(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.updateMyProfileImage()');
    try {
        Log.debug('STARTED validation of update my profile image.');
        const schema = Joi.object().keys({
            profileImage: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Profile image'
                    }),
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updateMyProfileImage()', error);
        next(error);
    }
}

export async function addAttachment(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.addAttachment()');
    try {
        Log.debug('STARTED validation of add attachment.');
        const schema = Joi.object().keys({
            type: Joi.string()
                .allow(...Object.keys(USER_DOC_TYPES))
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'type'
                    }),
                }),
            attachment: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'attachment'
                    }),
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'addAttachment()', error);
        next(error);
    }
}

export async function updateActions(req: any, res: Response, next: NextFunction): Promise<void> {

    Log.info(TAG + '.updateUserActions()');
    try {
        Log.debug('STARTED validation of update user actions.');
        const schema = Joi.object().keys({
            action: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'action'
                    }),
                }),
        });
    } catch (error) {
        Log.error(TAG, 'updateUserActions()', error);
        next(error);
    }
}
