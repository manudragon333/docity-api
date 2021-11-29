import {NextFunction} from 'express';
import {Log} from 'models';
import * as Joi from 'joi';
import {buildErrorMessage} from 'utils/string';
import {ErrorMessages} from 'constants/error_constants';
import {
    baseQueryListValidation,
    idValidation,
    mobileNumberValidation, searchTextValidation,
    uniqueIdentifiedValidation,
    validate
} from 'validations/common';

const TAG = 'validations.property_request';

export function doNothing(req, res, next) {
    next();
}

export async function saveVerifyProperty(req: any, res: any, next: NextFunction): Promise<void> {
    Log.info(TAG + '.saveVerifyProperty()');
    try {
        Log.debug('STARTED validation of save verify property request.');
        let schema = Joi.object().keys({
            referenceId: Joi.string(),
            propertyType: idValidation('propertyTypeId')
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property type'
                    })
                }),
            region: idValidation('regionId')
                .required().messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Region'
                    })
                }),
            name: Joi.string().allow(null, ''),
            emailId: Joi.string().email().allow(null, '')
                .messages({
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_FIELD, {
                        $field: 'Email'
                    })
                }),
            contactNumber: mobileNumberValidation().allow('', null)
                .messages({
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'Contact number',
                        $length: '10'
                    }),
                    'string.max': buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
                        $field: 'Contact number',
                        $length: '13'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_FIELD, {
                        $field: 'Contact number'
                    })
                }),
            address: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.number(),
            latitude: Joi.number(),
            longitude: Joi.number(),
        });
        schema = schema.append({
            propertyRequestId: Joi.string().allow(null),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'saveVerifyProperty()', error);
        next(error);
    }
}

export async function getAllPropertyRequests(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.getAllPropertyRequests()');

    try {
        let schema = baseQueryListValidation();
        schema = schema.append({
            status: Joi.string().allow(''),
            region: Joi.string().allow(''),
            propertyType: Joi.string().allow(''),
            location: Joi.string().allow(''),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'getAllPropertyRequests()', error);
        next(error);
    }
}

export async function getAllPropertyRequestLocations(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.getAllPropertyRequestLocations()');

    try {
        const schema = Joi.object().keys({
            search: searchTextValidation(),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'getAllPropertyRequestLocations()', error);
        next(error);
    }
}

export async function updatePropertyDocumentWriter(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.getAllPropertyRequests()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            name: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Name'
                    })
                }),
            contactNumber: mobileNumberValidation()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Contact number'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'Contact number',
                        $length: '10'
                    }),
                    'string.max': buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
                        $field: 'Contact number',
                        $length: '13'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_FIELD, {
                        $field: 'Contact number'
                    }),
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updatePropertyDocumentWriter()', error);
        next(error);
    }
}

export async function saveContactMeRequest(req: any, res: any, next: NextFunction): Promise<void> {
    Log.info(TAG + '.saveContactMeRequest()');
    try {
        Log.debug('STARTED validation of verify property request.');
        const schema = Joi.object().keys({
            propertyType: idValidation('propertyTypeId')
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property type'
                    })
                }),
            region: idValidation('regionId')
                .required().messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Region'
                    })
                }),
            name: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Name'
                    })
                }),
            emailId: Joi.string().email().allow(null, '')
                .messages({
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_FIELD, {
                        $field: 'Email'
                    })
                }),
            contactNumber: mobileNumberValidation().allow('', null)
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Contact number'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'Contact number',
                        $length: '10'
                    }),
                    'string.max': buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
                        $field: 'Contact number',
                        $length: '13'
                    }),
                    'string.pattern': buildErrorMessage(ErrorMessages.INVALID_FIELD, {
                        $field: 'Contact number'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'saveContactMeRequest()', error);
        next(error);
    }
}

export async function savePropertyDoc(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.savePropertyDoc()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'savePropertyDoc()', error);
        next(error);
    }
}

export async function linkPropertyDoc(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.linkPropertyDoc()');
    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            propertyChatId: Joi.string().required(),
            attachmentType: Joi.string().required(),
            type: Joi.string().required(),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'linkPropertyDoc()', error);
        next(error);
    }
}

export async function getPropertyDocs(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.getPropertyDocs()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'getPropertyDocs()', error);
        next(error);
    }
}

export async function deletePropertyDoc(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.deletePropertyDoc()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            propertyDocId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property doc ID'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'deletePropertyDoc()', error);
        next(error);
    }
}

export async function updatePropertyDocNotes(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.updatePropertyDocNotes()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            propertyDocId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property doc ID'
                    })
                }),
            notes: Joi.string()
                .min(3)
                .max(255)
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Notes'
                    }),
                    'string.min': buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
                        $field: 'Notes',
                        $length: '3'
                    }),
                    'string.max': buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
                        $field: 'Notes',
                        $length: '255'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updatePropertyDocNotes()', error);
        next(error);
    }
}

export async function assignCivilEngineerToPropertyRequest(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.assignCivilEngineerToPropertyRequest()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            civilEngineer: idValidation('civilEngineerID')
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Civil engineer'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'assignCivilEngineerToPropertyRequest()', error);
        next(error);
    }
}

export async function updatePropertyRequestCivilEngineerResponse(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.updatePropertyRequestCivilEngineerResponse()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            action: Joi.string().valid('ACCEPT', 'DECLINE')
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Civil engineer'
                    })
                }),
            estimatedFinishDate: Joi.date().allow('', null),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestCivilEngineerResponse()', error);
        next(error);
    }
}

export async function updatePropertyRequestStatus(req: any, res: any, next: NextFunction) {
    Log.info(TAG + '.updatePropertyRequestStatus()');

    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            action: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Civil engineer'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestStatus()', error);
        next(error);
    }
}

function commentSchema() {
    return Joi.object().keys({
        propertyRequestId: uniqueIdentifiedValidation()
            .required()
            .messages({
                'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                    $field: 'Property request ID'
                })
            }),
        propertyDocId: uniqueIdentifiedValidation()
            .required()
            .messages({
                'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                    $field: 'Property doc ID'
                })
            }),
        note: Joi.string().allow('', null),
        type: Joi.string().allow('', null),
        positionX: Joi.number().allow(null),
        positionY: Joi.number().allow(null),
        width: Joi.number().allow(null),
        height: Joi.number().allow(null),
        pageNumber: Joi.number().allow(null),
    });
}

export async function addDocumentComment(req: any, res: any, next: NextFunction) {
    try {
        const schema = commentSchema();
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'addDocumentComment()', error);
        next(error);
    }
}

export async function deleteDocumentComment(req: any, res: any, next: NextFunction) {
    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            propertyDocId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property doc ID'
                    })
                }),
            commentId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Comment ID'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'deleteDocumentComment()', error);
        next(error);
    }
}

export async function updateDocumentComment(req: any, res: any, next: NextFunction) {
    try {
        let schema = commentSchema();
        schema = schema.append({
            commentId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Comment ID'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updateDocumentComment()', error);
        next(error);
    }
}

export async function getDocumentComments(req: any, res: any, next: NextFunction) {
    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            propertyDocId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property doc ID'
                    })
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'getDocumentComments()', error);
        next(error);
    }
}

export async function updatePropertyRequestFinalReport(req: any, res: any, next: NextFunction) {
    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            finalReport: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'finalReport'
                    })
                }),
            note: Joi.string().allow('', null)
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestFinalReport()', error);
        next(error);
    }
}

export async function shareFinalReport(req: any, res: any, next: NextFunction) {
    try {
        const schema = Joi.object().keys({
            propertyRequestId: uniqueIdentifiedValidation()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Property request ID'
                    })
                }),
            toMails: Joi.array().min(1)
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'To mails'
                    }),
                    'array.min': buildErrorMessage(ErrorMessages.MINIMUM_ITEM_REQUIRED, {
                        $field: 'To mails',
                        $value: 1,
                    })
                }),
            ccMails: Joi.array(),
            bccMails: Joi.string(),
            subject: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Mail subject'
                    }),
                }),
            body: Joi.string()
                .required()
                .messages({
                    'any.required': buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                        $field: 'Mail body'
                    }),
                }),
        });
        await validate(schema, req, res, next);
    } catch (error) {
        Log.error(TAG, 'shareFinalReport()', error);
        next(error);
    }
}
