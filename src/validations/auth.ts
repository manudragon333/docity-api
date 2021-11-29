import {NextFunction, Response} from 'express';
import {Log} from 'models';
import * as Joi from 'joi';
import {buildErrorMessage} from 'utils/string';
import {ErrorMessages} from 'constants/error_constants';
import {mobileNumberValidation, validate} from 'validations/common';

const TAG = 'validations.user';

export async function login(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.login()');
    try {
        Log.debug('STARTED validation of login user.');
        const schema = Joi.object().keys({
            userName: Joi.string()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Username'
                    })
                }),
            password: Joi.string()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'password'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'login()', error);
        next(error);
    }
}

export async function registerUser(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.registerUser()');
    try {
        Log.debug('STARTED validation of register user.');
        const schema = Joi.object().keys({
            firstName: Joi.string()
                .min(3)
                .max(125)
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'First name'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'First name',
                        $length: '3'
                    }),
                    'string.max': buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
                        $field: 'First name',
                        $length: '3'
                    })
                }),
            lastName: Joi.string()
                .allow('', null),
            emailId: Joi.string()
                .email()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Email'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_EMAIL, {
                        $field: 'Email'
                    }),
                }),
            mobileNumber: mobileNumberValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Contact number'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'Contact number',
                        $length: '10'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_FIELD, {
                        $field: 'Contact number'
                    }),
                }),
            password: Joi.string()
                .required()
                .min(6)
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'password'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'password',
                        $length: '6'
                    }),
                }),
            termsAndConditions: Joi.boolean().default(false)
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'registerUser()', error);
        next(error);
    }
}

export async function forgetPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.forgetPassword()');
    try {
        Log.debug('STARTED validation of forget password user.');
        const schema = Joi.object().keys({
            userName: Joi.string()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Username'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'forgetPassword()', error);
        next(error);
    }
}

export async function resetPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.resetPassword()');
    try {
        Log.debug('STARTED validation of reset  user password.');
        const schema = Joi.object().keys({
            token: Joi.string()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'token'
                    })
                }),
            password: Joi.string()
                .required()
                .min(6)
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'password'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'password',
                        $length: '6'
                    }),
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'resetPassword()', error);
        next(error);
    }
}

export async function resendVerificationLink(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.resendVerificationLink()');
    try {
        Log.debug('STARTED validation of resend verification link.');
        const schema = Joi.object().keys({
            userName: Joi.string()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Username'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'resendVerificationLink()', error);
        next(error);
    }
}

export async function verifyUser(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.verifyUser()');
    try {
        Log.debug('STARTED validation of verify user.');
        const schema = Joi.object().keys({
            tk: Joi.string()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'token'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'verifyUser()', error);
        next(error);
    }
}

export function doNothing(req, res, next) {
    next();
}

export async function saveInvitedUserDetails(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const schema = Joi.object().keys({
            firstName: Joi.string()
                .min(3)
                .max(125)
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'First name'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'First name',
                        $length: '3'
                    }),
                    'string.max': buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
                        $field: 'First name',
                        $length: '3'
                    })
                }),
            lastName: Joi.string()
                .allow('', null),
            emailId: Joi.string()
                .email()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Email'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_EMAIL, {
                        $field: 'Email'
                    }),
                }),
            mobileNumber: mobileNumberValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Contact number'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'Contact number',
                        $length: '10'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_FIELD, {
                        $field: 'Contact number'
                    }),
                }),
            password: Joi.string()
                .required()
                .min(6)
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'password'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'password',
                        $length: '6'
                    }),
                }),
            termsAndConditions: Joi.boolean()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'termsAndConditions'
                    })
                }),
            token: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'token'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'saveInvitedUserDetails()', error);
        next(error);
    }
}

export async function refreshSession(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.refreshSession()');
    try {
        Log.debug('STARTED validation of refresh session!.');
        const schema = Joi.object().keys({
            refreshToken: Joi.string()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Username'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'refreshSession()', error);
        next(error);
    }
}

export async function checkEmailAlreadyRegistered(req: any, res: Response, next: NextFunction): Promise<void> {
    Log.info(TAG + '.checkEmailAlreadyRegistered()');
    try {
        Log.debug('STARTED validation of email!.');
        const schema = Joi.object().keys({
            emailId: Joi.string()
                .email()
                .required()
                .messages({
                    'any.': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Username'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_EMAIL, {
                        $field: 'Email'
                    }),
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'checkEmailAlreadyRegistered()', error);
        next(error);
    }
}
