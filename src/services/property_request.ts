import {IPropertyRequest} from 'src/models/lib/property_request';
import {
    APIError,
    BaseRecord,
    EmailRecipient,
    EmailSender,
    IBaseListAPIRequest,
    IBaseRecord,
    IPropertyRequestListApiRequest,
    IServiceResponse,
    IUser,
    IUserSession,
    ListAPIResponse,
    Log,
    ServiceResponse
} from 'models';
import {HttpStatusCodes} from 'constants/status_codes';
import {PaymentData, PropertyContactData, PropertyRequestData, SequenceData} from 'data_stores/mongo_db';
import {IPropertyContact} from 'src/models/lib/property_contact';
import {verifyPropertyContactForeignKeys} from 'helpers/foreign_key_checks/property_contact';
import {verifyPropertyRequestForeignKeys} from 'helpers/foreign_key_checks/property_request';
import {PathParams} from 'constants/api_params';
import {ErrorCodes} from 'constants/error_constants';
import * as fs from 'fs';
import {unlinkSync} from 'fs';
import path from 'path';
import {propertyDocDataMapping} from 'helpers/data_mapping/property_doc';
import {getDocumentTypeById} from 'data_stores/mongo_db/lib/masterdata';
import {ROLE_LIST, SEQUENCE_TYPES, STATUS_LIST} from 'constants/master_data';
import {fetchUserDetails, fetchUserEmailsByRole} from 'data_stores/mongo_db/lib/user';
import {IDocComment} from 'src/models/lib/doc_comment';
import {groupBy} from 'lodash';
import {AWS_S3, REDIRECT_URLS, SENDER_EMAIL_ID} from 'loaders/config';
import {sendEmail} from 'helpers/email';
import {loadTemplates} from 'loaders/template';
import {fetchRoleByName} from 'data_stores/mongo_db/cache/role';
import {deleteS3File, getFileURL, readFiles, saveFiles} from 'helpers/s3_media';
import {MAX_SEQUENCE, S3_STORAGE} from 'constants/app_defaults';
import mongoose from 'mongoose';
import {findRecord} from 'data_stores/mongo_db/lib/property_chat';

const TAG = 'services.property_request';

export async function saveContactMeRequest(loggedInUser: IUserSession, payload: IPropertyContact)
    : Promise<IServiceResponse> {
    Log.info(TAG + '.saveContactMeRequest()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully created contact me. Our Agent will contact you soon.', true);
    try {
        await verifyPropertyContactForeignKeys(serviceResponse, payload);
        if (serviceResponse?.errors?.length) {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'Invalid request body!!';
            return serviceResponse;
        }
        serviceResponse.data = await PropertyContactData.saveContactMeRequest(loggedInUser, payload);
    } catch (error) {
        Log.error(TAG, 'verifyProperty()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('save', 'contactMeRequest'));
    }
    return serviceResponse;
}

export function addPaddingZeros(sqNumber: number, padZeros: number): string {
    return sqNumber.toString().padStart(padZeros, '0');
}

export async function saveVerifyProperty(loggedInUser: IUserSession, payload: IPropertyRequest)
    : Promise<IServiceResponse> {
    Log.info(TAG + '.saveVerifyProperty()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully created verify property request.', true);
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        const sequenceNubSeries =
            await SequenceData.fetchAndUpdateLatestSequenceNumber(SEQUENCE_TYPES.PROPERTY_REQUEST.name,
                SEQUENCE_TYPES.PROPERTY_REQUEST.default_series);
        payload.referenceId = sequenceNubSeries.series + addPaddingZeros(sequenceNubSeries.nb,
            MAX_SEQUENCE.toString().length);
        await verifyPropertyRequestForeignKeys(serviceResponse, payload);
        if (serviceResponse?.errors?.length) {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'Invalid request body!!';
            return serviceResponse;
        }
        serviceResponse.data = await PropertyRequestData.saveVerifyProperty(payload, loggedInUser);
    } catch (error) {
        Log.error(TAG, 'saveVerifyProperty()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('verify', 'property'));
    }
    if (serviceResponse?.errors?.length) {
        Log.debug('ROLLBACK');
        await session?.abortTransaction();
    } else {
        Log.debug('COMMIT');
        await session?.commitTransaction();
    }
    session.endSession();
    return serviceResponse;
}

export async function updateVerifyPropertyRequest(loggedInUser: IUserSession, payload: IPropertyRequest):
    Promise<IServiceResponse> {
    Log.info(TAG + '.saveVerifyProperty()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully updated verify property request.', true);
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        await verifyPropertyRequestForeignKeys(serviceResponse, payload);
        serviceResponse.data = await PropertyRequestData.updateVerifyPropertyRequest(payload, loggedInUser);
    } catch (err) {
        Log.error(TAG, 'updateVerifyPropertyRequest ()', err);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('verify', 'property'));
    }
    if (serviceResponse?.errors?.length) {
        Log.debug('ROLLBACK');
        await session?.abortTransaction();
    } else {
        Log.debug('COMMIT');
        await session?.commitTransaction();
    }
    session.endSession();
    return serviceResponse;
}

export async function getAllPropertyRequests(loggedInUser: IUserSession, queryParams: IPropertyRequestListApiRequest)
    : Promise<IServiceResponse> {
    Log.info(TAG + '.getAllPropertyRequests()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully fetched property requests.', true);
    try {
        const records = await PropertyRequestData.getAllPropertyRequests(loggedInUser, queryParams);
        const recordCount = await PropertyRequestData.getAllPropertyRequestsCount(loggedInUser, queryParams);
        serviceResponse.data = new ListAPIResponse(records, recordCount > queryParams.limit,
            queryParams.offset, queryParams.limit, recordCount, queryParams.sortBy, queryParams.sortOrder, '');
    } catch (error) {
        Log.error(TAG, 'getAllPropertyRequests()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('fetch', 'properties'));
    }
    return serviceResponse;
}

export async function getAllPropertyRequestLocations(loggedInUser: IUserSession, search: string) {
    Log.info(TAG + '.getAllPropertyRequests()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED,
        'Successfully fetched property request locations.', false);
    try {
        let result = await PropertyRequestData.getAllPropertyRequestLocations(loggedInUser, search);
        result = result.reduce((acc, current) => {
            const x = acc.find((res) => res.city === current.city);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        serviceResponse.data = new ListAPIResponse(result);
    } catch (error) {
        Log.error(TAG, 'getAllPropertyRequestLocations', error);
    }
    return serviceResponse;
}

export async function getAllPropertyContacts(loggedInUser: IUserSession, queryParams: IBaseListAPIRequest) {
    Log.info(TAG + 'getAllPropertyContacts()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully fetched the property contact requests.', false);
    try {
        const result = await PropertyContactData.getAllPropertyContactMeRequests(loggedInUser, queryParams);
        serviceResponse.data = new ListAPIResponse(result);
    } catch (err) {
        Log.error(TAG, 'getAllPropertyContacts()', err);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('fetch', 'contacts'));
    }
    return serviceResponse;
}

async function deleteSavedFiles(files) {
    try {
        for (const file of files) {
            if (typeof file === 'string') {
                if (S3_STORAGE.enabled) {
                    deleteS3File(file, AWS_S3.docBucket).catch((error) => {
                        Log.error(TAG, 'deleteSavedFiles()', error);
                    });
                } else {
                    unlinkSync(path.resolve('./' + file));
                }
            } else {
                if (S3_STORAGE.enabled) {
                    deleteS3File(file.path, AWS_S3.docBucket).catch((error) => {
                        Log.error(TAG, 'deleteSavedFiles()', error);
                    });
                } else {
                    unlinkSync(path.resolve('./' + file.path));
                }
            }
        }
    } catch (error) {
        Log.error(TAG, 'deleteSavedFiles()', error);
        throw error;
    }
}

export async function savePropertyDocs(req: any, res: any) {
    const loggedInUser: IUserSession = req.userSession;
    const propertyRequestID = req.params[PathParams.PROPERTY_REQUEST_ID];
    Log.info(TAG + 'getAllPropertyContacts()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully saved the property document.', false);
    try {
        const isPropertyExist = await PropertyRequestData.checkPropertyRequestExist(propertyRequestID);
        if (isPropertyExist) {
            await saveFiles(req, res, AWS_S3.docBucket);
            const body = req.body;
            Log.debug('BODY: ', body);
            if (body.attachmentType) {
                const attachmentType = await getDocumentTypeById(body.attachmentType);
                if (attachmentType) {
                    const promises = [];
                    for (const file of req.files) {
                        const saveFile = propertyDocDataMapping(propertyRequestID, attachmentType, file,
                            loggedInUser);
                        promises.push(PropertyRequestData.savePropertyDocument(loggedInUser, saveFile));
                    }
                    const docs = await Promise.all(promises);
                    for (const doc of docs) {
                        doc.path = await getFileURL(doc.path, AWS_S3.docBucket);
                    }
                    serviceResponse.data = docs;
                } else {
                    serviceResponse.message = 'Invalid Attachment type.';
                    serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
                    serviceResponse.addError(
                        new APIError('Invalid Attachment type.', ErrorCodes.VALIDATION_ERROR,
                            'attachmentType')
                    );
                }
            } else {
                serviceResponse.message = 'Attachment type is required.';
                serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
                serviceResponse.addError(
                    new APIError('Attachment Type is required.', ErrorCodes.VALIDATION_ERROR,
                        'attachmentType')
                );
            }
        } else {
            serviceResponse.message = 'Property request does not exist!!';
            serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.addError(
                new APIError('Property request does not exist!!', ErrorCodes.RESOURCE_NOT_FOUND,
                    'propertyRequestID')
            );
        }
    } catch (err) {
        Log.error(TAG, 'savePropertyDocs()', err);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('save', 'property docs'));
    }
    if (serviceResponse?.errors?.length && req.files) {
        deleteSavedFiles(req.files).catch((error) => {
            Log.error(TAG, 'deleteFiles()', error);
        });
    }
    return serviceResponse;
}

export async function linkPropertyDoc(req: any, res: any) {
    const loggedInUser: IUserSession = req.userSession;
    const propertyRequestID = req.params[PathParams.PROPERTY_REQUEST_ID];
    const noteId = req.params[PathParams.PROPERTY_CHAT_ID];
    const body = req.body;
    Log.debug('Body:', body);
    Log.info(TAG + 'getAllPropertyContacts()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully linked the property document.', false);
    try {
        const attachmentPath = await findRecord(noteId);
        if (body.attachmentType) {
            const attachmentType = await getDocumentTypeById(body.attachmentType);
            if (attachmentType) {
                const file = {
                    path: attachmentPath.attachment_path
                };
                const saveFile = propertyDocDataMapping(propertyRequestID, attachmentType, file,
                    loggedInUser);
                const doc = await PropertyRequestData.savePropertyDocument(loggedInUser, saveFile);
                doc.path = await getFileURL(doc.path, AWS_S3.docBucket);
                serviceResponse.data = doc;
            } else {
                serviceResponse.message = 'Invalid Attachment type.';
                serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
                serviceResponse.addError(
                    new APIError('Invalid Attachment type.', ErrorCodes.VALIDATION_ERROR,
                        'attachmentType')
                );
            }
        } else {
            serviceResponse.message = 'Attachment type is required.';
            serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
            serviceResponse.addError(
                new APIError('Attachment Type is required.', ErrorCodes.VALIDATION_ERROR,
                    'attachmentType')
            );
        }
    } catch (error) {
        Log.error(TAG, 'linkPropertyDoc()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('save', 'property doc'));
    }
    if (serviceResponse?.errors?.length && req.files) {
        deleteSavedFiles(req.files).catch((error) => {
            Log.error(TAG, 'deleteFiles()', error);
        });
    }
    return serviceResponse;
}

export async function deletePropertyDoc(id: string) {
    Log.info(TAG + 'deletePropertyDoc()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully deleted the property document.', true);
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        const result = await PropertyRequestData.deletePropertyDocument(id);
        if (result) {
            await deleteSavedFiles([result]);
        }
    } catch (error) {
        Log.error(TAG, 'deletePropertyDoc()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('delete', 'property docs'));
    }
    if (serviceResponse?.errors?.length) {
        Log.debug('ROLLBACK');
        await session.abortTransaction();
    } else {
        Log.debug('COMMIT');
        await session.commitTransaction();
    }
    session?.endSession();
    return serviceResponse;
}

export async function getPropertyDocs(propertyRequestId: string) {
    Log.info(TAG + 'getPropertyDocs()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully fetched the property documents.', false);
    try {
        const result = await PropertyRequestData.getPropertyDocuments(propertyRequestId);
        for (const doc of result) {
            doc.path = await getFileURL(doc.path, AWS_S3.docBucket);
        }
        const groupedResult = groupBy(result, 'attachmentType.name');
        serviceResponse.data = groupedResult;
    } catch (error) {
        Log.error(TAG, 'getPropertyDocs()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('fetch', 'property docs'));
    }
    return serviceResponse;
}

export async function updatePropertyDocNotes(propertyDocId: string, notes: string) {
    Log.info(TAG + 'updatePropertyDocNotes()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully updated the property document notes.', true);
    try {
        await PropertyRequestData.updatePropertyDocument(propertyDocId, notes);
        serviceResponse.data = await PropertyRequestData.getPropertyDocument(propertyDocId);
    } catch (error) {
        Log.error(TAG, 'updatePropertyDocNotes()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('update', 'property docs'));
    }
    return serviceResponse;
}

export async function updatePropertyDocumentWriter(propertyRequestId: string, documentWriter: any) {
    Log.info(TAG + 'updatePropertyDocumentWriter()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully saved the property document writer details.', true);
    try {
        await PropertyRequestData.updatePropertyDocumentWriter(propertyRequestId, documentWriter);
        serviceResponse.data = await PropertyRequestData.getPropertyRequestById(propertyRequestId);
    } catch (error) {
        Log.error(TAG, 'updatePropertyDocumentWriter()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('save', 'property doc wirter'));
    }
    return serviceResponse;
}

export async function getPropertyRequestDetails(propertyRequestId: string) {
    Log.info(TAG + 'getPropertyRequestDetails()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully fetched the property document writer details.', false);
    try {
        const property: any = await PropertyRequestData.getPropertyRequestById(propertyRequestId);
        if (property) {
            const docs = await PropertyRequestData.getPropertyDocuments(propertyRequestId);
            for (const doc of docs) {
                doc.path = await getFileURL(doc.path, AWS_S3.docBucket);
            }
            if (property?.finalReport?.path) {
                property.finalReport.path = await getFileURL(property?.finalReport?.path, AWS_S3.docBucket);
            }
            property.documents = groupBy(docs, 'attachmentType.name');
            const payments = await PaymentData.findLatestOrderByPropertyRequest(propertyRequestId);
            if (payments) {
                payments.status = new BaseRecord(STATUS_LIST[payments.status].id, STATUS_LIST[payments.status].name);
            }
            property.payments = payments ?? {};
        }
        serviceResponse.data = property;
    } catch (error) {
        Log.error(TAG, 'getPropertyRequestDetails()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('fetch', 'property request'));
    }
    return serviceResponse;
}

export async function assignPropertyRequestToCivilEngineer(propertyRequestId: string, civilEngineer: IBaseRecord) {
    Log.info(TAG + 'assignPropertyRequestToCivilEngineer()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully fetched the property document writer details.', false);
    try {
        const propertyRequestDetails = await PropertyRequestData.getPropertyRequestById(propertyRequestId);
        if (STATUS_LIST['4'].name === propertyRequestDetails.paymentStatus.name) {
            serviceResponse.message = 'Please complete payment.';
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.addError(new APIError('Payment is in pending.', ErrorCodes.PAYMENT_PENDING, 'payment'));
        }
        const user: IUser = await fetchUserDetails(civilEngineer.id);
        if (user.role.indexOf(ROLE_LIST.CIVIL_ENGINEER.name) !== -1) {
            serviceResponse.message = 'Invalid civil engineer.';
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.addError(new APIError('Invalid civil engineer.', ErrorCodes.RESOURCE_NOT_FOUND, 'civilEngineer'));
        } else {
            await PropertyRequestData.assignPropertyRequestToCivilEngineer(propertyRequestId, civilEngineer.id);
            serviceResponse.data = await PropertyRequestData.getPropertyRequestById(propertyRequestId);
        }
    } catch (error) {
        Log.error(TAG, 'assignPropertyRequestToCivilEngineer()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('assign',
            'civil engineer to property request'));
    }
    return serviceResponse;
}

export async function updatePropertyRequestCivilEngineerResponse(loggedInUser: IUserSession,
                                                                 propertyRequestId: string,
                                                                 action: string,
                                                                 estimatedFinishDate: string) {
    Log.info(TAG + 'updatePropertyRequestCivilEngineerResponse()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully fetched the property document writer details.', false);
    try {
        let ceStatus = STATUS_LIST['13'].id;
        let status = STATUS_LIST['3'].id;
        if (action.toUpperCase() == 'ACCEPT') {
            status = STATUS_LIST['5'].id;
            ceStatus = STATUS_LIST['12'].id;
        } else {
            status = STATUS_LIST['2'].id;
            ceStatus = STATUS_LIST['13'].id;
        }
        await PropertyRequestData.updatePropertyRequestCivilEngineerResponse(propertyRequestId, loggedInUser, ceStatus,
            estimatedFinishDate, status);
        serviceResponse.data = await PropertyRequestData.getPropertyRequestById(propertyRequestId);
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestCivilEngineerResponse()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('update',
            'civil engineer response of property request'));
    }
    return serviceResponse;
}

export async function updatePropertyRequestStatus(propertyRequestId: string,
                                                  action: string) {
    Log.info(TAG + 'updatePropertyRequestStatus()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully updated property request status.', true);
    try {
        const status: any = Object.keys(STATUS_LIST).filter((key) => {
            if (STATUS_LIST[key].name == action.toLowerCase()) {
                return key;
            }
        })[0];
        if (status) {
            await PropertyRequestData.updatePropertyRequestStatus(propertyRequestId, status);
            serviceResponse.data = await PropertyRequestData.getPropertyRequestById(propertyRequestId);
        } else {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'Invalid Action!!';
            serviceResponse.addError(new APIError('Invalid action!!', ErrorCodes.VALIDATION_ERROR, 'action'));
        }
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestStatus()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('update',
            ' property request status'));
    }
    return serviceResponse;
}

export async function getPropertyDocument(id: string) {
    Log.info(TAG + 'getPropertyDocument()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully fetched the property document.', false);
    try {
        const document: any = await PropertyRequestData.getPropertyDocument(id);
        serviceResponse.data = document;
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestToCivilEngineerResponse()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('update',
            'civil engineer response of property request'));
    }
    return serviceResponse;
}

export async function saveDocumentComment(loggedInUser: IUserSession, propertyDocId: string, comment: IDocComment) {
    Log.info(TAG + 'saveDocumentComment()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully saved the property document comment.', false);
    try {
        await PropertyRequestData.savePropertyDocComment(loggedInUser, propertyDocId, comment);
        serviceResponse.data = await PropertyRequestData.fetchPropertyDocComments(propertyDocId);
    } catch (error) {
        Log.error(TAG, 'saveDocumentComment()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('save',
            'comment'));
    }
    return serviceResponse;
}

export async function getDocumentComment(loggedInUser: IUserSession, propertyDocId: string) {
    Log.info(TAG + 'getDocumentComment()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully saved the property document comment.', false);
    try {
        serviceResponse.data = await PropertyRequestData.fetchPropertyDocComments(propertyDocId);
    } catch (error) {
        Log.error(TAG, 'getDocumentComment()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('get',
            'comments'));
    }
    return serviceResponse;
}

export async function updateDocumentComment(loggedInUser: IUserSession, propertyDocId: string,
                                            commentId: string,
                                            comment: IDocComment) {
    Log.info(TAG + 'updateDocumentComment()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully updated the property document comment.', false);
    try {
        serviceResponse.data = await PropertyRequestData.updatePropertyDocComment(loggedInUser,
            propertyDocId, commentId, comment);
        serviceResponse.data = await PropertyRequestData.fetchPropertyDocComments(propertyDocId);
    } catch (error) {
        Log.error(TAG, 'updateDocumentComment()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('update',
            'comment'));
    }
    return serviceResponse;
}

export async function deleteDocumentComment(loggedInUser: IUserSession, propertyDocId: string,
                                            commentId: string) {
    Log.info(TAG + 'deleteDocumentComment()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully deleted the property document comment.', false);
    try {
        await PropertyRequestData.deletePropertyComments(propertyDocId, commentId);
    } catch (error) {
        Log.error(TAG, 'deleteDocumentComment()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('delete',
            'comment'));
    }
    return serviceResponse;
}

export async function sendFinalReportMail(toEmailId: string, userName, referenceId: string) {
    try {
        const compiledTemplates = await loadTemplates();
        const finalReportMail = compiledTemplates.FINALREPORT;
        console.log(finalReportMail);
        const mailBody = finalReportMail({
            redirectUrl: REDIRECT_URLS.RIDIRECT_URL,
            userName: userName,
            id: referenceId,
        });
        console.log(mailBody);
        const superAdminRole: IBaseRecord = await fetchRoleByName(ROLE_LIST.SUPER_ADMIN.name);
        const superAdminEmails = await fetchUserEmailsByRole(superAdminRole.id);
        sendEmail(new EmailSender(SENDER_EMAIL_ID),
            new EmailRecipient([toEmailId], superAdminEmails), 'FINAL REPORT', mailBody)
            .catch((error) => {
                Log.error(TAG, 'sendEmail()', error);
            });
    } catch (error) {
        Log.error(TAG, 'sendFinalReportMail()', error);
        throw error;
    }
}

export async function updatePropertyRequestFinalReport(req: any, res: any) {
    const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
    Log.info(TAG + 'updatePropertyRequestFinalReport()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully saved the final report.', false);
    try {
        const propertyRequest = await PropertyRequestData.getPropertyRequestById(propertyRequestId);
        if (propertyRequest) {
            if (propertyRequest?.status?.id == String(STATUS_LIST['6'].id)) {
                serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
                serviceResponse.message = 'Final report already generated!';
                serviceResponse.addError(new APIError('Final report already generated!',
                    ErrorCodes.RESOURCE_NOT_FOUND, 'propertyRequestId'));
            } else {
                await saveFiles(req, res, AWS_S3.docBucket);
                const {
                    note,
                } = req.body;
                if (req.files.length) {
                    const file = req.files[0];
                    if (file?.path) {
                        file.path = file?.path[0] == '/' ? file.path : '/' + file?.path;
                    }
                    await PropertyRequestData.updateFinalReport(req.userSession, propertyRequestId,
                        (file.key ?? file.path), note, STATUS_LIST['6'].id);
                    sendFinalReportMail(propertyRequest.emailId, propertyRequest.name, propertyRequest.referenceId)
                        .catch((error) => {
                            Log.error(TAG, 'sendFinalReportMail()', error);
                        });
                    serviceResponse.data = {
                        path: await getFileURL(req.files[0].key, AWS_S3.docBucket),
                        note: note,
                    };
                } else {
                    serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
                    serviceResponse.message = 'Final report is required!';
                    serviceResponse.addError(new APIError('Final report is required!',
                        ErrorCodes.RESOURCE_NOT_FOUND, 'finalReport'));
                }
            }
        } else {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'Property request not found!';
            serviceResponse.addError(new APIError('Property request not found!', ErrorCodes.RESOURCE_NOT_FOUND,
                'propertyRequestId'));
        }
    } catch (error) {
        Log.error(TAG, 'updatePropertyRequestFinalReport()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('update',
            'final report'));
    }
    return serviceResponse;
}

export async function shareFinalReport(loggedInUser: IUserSession,
                                       propertyRequestID: string,
                                       payload: any) {
    Log.info(TAG + 'shareFinalReport()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully shared the final report.', false);
    const {
        body,
        subject,
        toMails,
        ccMails,
        bccMails,
    } = payload;
    try {
        const propertyRequest = await PropertyRequestData.getPropertyRequestById(propertyRequestID);
        if (propertyRequest) {
            const finalReport = propertyRequest.finalReport;
            if (finalReport?.path) {
                const attachments = [];
                if (S3_STORAGE.enabled) {
                    const attachment = await readFiles(finalReport.path, AWS_S3.docBucket);
                    attachments.push({
                        filename: propertyRequest.referenceId + '.pdf',
                        content: attachment?.createReadStream(),
                    });
                } else {
                    attachments.push({
                        filename: propertyRequest.referenceId + '.pdf',
                        content: fs.createReadStream(finalReport.path),
                    });
                }
                sendEmail(
                    new EmailSender(SENDER_EMAIL_ID),
                    new EmailRecipient(toMails, ccMails, bccMails),
                    subject,
                    body,
                    attachments,
                ).catch((error) => {
                    Log.debug('Failed to share the final Report from MAIL');
                    Log.error(TAG, 'sendEmail()', error);
                });
            } else {
                serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
                serviceResponse.message = 'Final report is not generated!';
                serviceResponse.addError(new APIError('Final report is not generated!',
                    ErrorCodes.RESOURCE_NOT_FOUND, 'propertyRequestId'));
            }
        } else {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'Property request not found!';
            serviceResponse.addError(new APIError('Property request not found!', ErrorCodes.RESOURCE_NOT_FOUND,
                'propertyRequestId'));
        }
    } catch (error) {
        Log.error(TAG, 'shareFinalReport()', error);
        serviceResponse.addServerError(serviceResponse.buildServiceFailedMessage('share',
            'final report'));
    }
    return serviceResponse;
}