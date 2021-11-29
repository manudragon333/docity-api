import {NextFunction, Response} from 'express';
import {
    IBaseListAPIRequest,
    IPropertyRequest,
    IPropertyRequestListApiRequest,
    IServiceResponse,
    IUserSession,
    Log
} from 'models';
import {propertyRequestDataMapping} from 'helpers/data_mapping/property_request';
import * as PropertyRequestService from 'services/property_request';
import {responseBuilder} from 'helpers/response_builder';
import {IPropertyContact} from 'src/models/lib/property_contact';
import {propertyContactDataMapping} from 'helpers/data_mapping/property_contact';
import {reqPropertyQueryDataMapping, reqQueryDataMapping} from 'helpers/data_mapping/req_query';
import {PathParams} from 'constants/api_params';
import path from 'path';
import {IDocComment} from 'src/models/lib/doc_comment';
import {docCommentDataMapping} from 'helpers/data_mapping/doc_comment';
import {PROPERTY_SORT_FIELDS} from 'constants/sort_fields';

const TAG = 'controllers.property_request';

export async function saveContactMeRequest(req: any, res: any, next: NextFunction) {
    try {
        Log.debug('REQUEST_BODY: ', req.body);
        const propertyContact: IPropertyContact = propertyContactDataMapping(req.body);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.saveContactMeRequest(req.userSession, propertyContact);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'saveContactMeRequest()', error);
        next(error);
    }

}

export async function saveVerifyProperty(req: any, res: any, next: NextFunction) {
    try {
        Log.debug('REQUEST_BODY: ', req.body);
        Log.debug('Logged in User: ', req.userSession);
        const propertyRequest: IPropertyRequest = propertyRequestDataMapping(req.body, req.userSession);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.saveVerifyProperty(req.userSession, propertyRequest);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'saveVerifyProperty()', error);
        next(error);
    }

}

export async function updateVerifyPropertyRequest(req: any, res: any, next: NextFunction) {
    try {
        Log.debug('REQUEST_BODY: ', req.body);
        Log.debug('Logged in User: ', req.userSession);
        const propertyRequest: IPropertyRequest = propertyRequestDataMapping(req.body, req.userSession);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.updateVerifyPropertyRequest(req.userSession, propertyRequest);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'update verify property request ()', err);
        next(err);
    }
}

export async function getAllPropertyRequests(req: any, res: Response, next: NextFunction) {

    try {
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('REQUEST_QUERY: ', req.query);
        const queryParams: IPropertyRequestListApiRequest = reqPropertyQueryDataMapping(req.query);
        queryParams.sortBy = PROPERTY_SORT_FIELDS[queryParams.sortBy];
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.getAllPropertyRequests(req.userSession, queryParams);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'getAllPropertyRequests()', err);
        next(err);
    }
}

export async function getAllPropertyRequestLocations(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('getAllPropertyRequestLocations()', req.userSession);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.getAllPropertyRequestLocations(req.userSession, req.query.search);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'getAllPropertyRequestLocations()', error);
    }
}

export async function getAllPropertyContacts(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('REQUEST_QUERY: ', req.query);
        const queryParams: IBaseListAPIRequest = reqQueryDataMapping(req.query);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.getAllPropertyContacts(req.userSession, queryParams);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'getAllPropertyContacts()', error);
        next(error);
    }
}

export async function savePropertyDocs(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('Logged in User: ', req.userSession);
        const serviceResponse: IServiceResponse = await PropertyRequestService.savePropertyDocs(req, res);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'savePropertyDocs()', err);
        next(err);
    }
}

export async function linkPropertyDoc(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('Logged in user:', req.userSession);
        const serviceResponse = await PropertyRequestService.linkPropertyDoc(req, res);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'linkPropertyDoc()', error);
        next(error);
    }
}

export async function getPropertyDocs(req: any, res: Response, next: NextFunction) {
    try {
        const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('fetching property docs', propertyRequestId);
        const serviceResponse: IServiceResponse = await PropertyRequestService.getPropertyDocs(propertyRequestId);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'getPropertyDocs()', err);
        next(err);
    }
}

export async function deletePropertyDoc(req: any, res: Response, next: NextFunction) {
    try {
        const propertyDocId = req.params[PathParams.PROPERTY_DOC_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('Deleting property doc', propertyDocId);
        const serviceResponse: IServiceResponse = await PropertyRequestService.deletePropertyDoc(propertyDocId);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'savePropertyDocs()', err);
        next(err);
    }
}

export async function updatePropertyDocNotes(req: any, res: Response, next: NextFunction) {
    try {
        const propertyDocId = req.params[PathParams.PROPERTY_DOC_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('updating property doc', propertyDocId);
        const serviceResponse: IServiceResponse = await PropertyRequestService.updatePropertyDocNotes(propertyDocId,
            req.body.notes);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'updatePropertyDoc()', err);
        next(err);
    }
}

export async function updatePropertyDocumentWriter(req: any, res: Response, next: NextFunction) {
    try {
        const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('updating property ', propertyRequestId);
        Log.debug('Body: ', req.body);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.updatePropertyDocumentWriter(propertyRequestId, req.body);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'updatePropertyDoc()', err);
        next(err);
    }
}

export async function getPropertyRequestDetails(req: any, res: Response, next: NextFunction) {
    try {
        const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('fetch property ', propertyRequestId);
        Log.debug('Body: ', req.body);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.getPropertyRequestDetails(propertyRequestId);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'updatePropertyDoc()', err);
        next(err);
    }
}

export async function assignPropertyRequestToCivilEngineer(req: any, res: Response, next: NextFunction) {
    try {
        const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('fetch property ', propertyRequestId);
        Log.debug('Body: ', req.body);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.assignPropertyRequestToCivilEngineer(propertyRequestId,
                req.body.civilEngineer);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'assignPropertyRequestToCivilEngineer()', err);
        next(err);
    }
}

export async function updatePropertyRequestCivilEngineerResponse(req: any, res: Response, next: NextFunction) {
    try {
        const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
        const action = req.params[PathParams.ACTION];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('fetch property ', propertyRequestId);
        Log.debug('Body: ', req.body);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.updatePropertyRequestCivilEngineerResponse(req.userSession,
                propertyRequestId, action, req.body.estimatedFinishDate);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'updatePropertyRequestCivilEngineerResponse()', err);
        next(err);
    }
}

export async function updatePropertyRequestStatus(req: any, res: Response, next: NextFunction) {
    try {
        const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
        const action = req.params[PathParams.ACTION];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('fetch property ', propertyRequestId);
        Log.debug('Body: ', req.body);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.updatePropertyRequestStatus(propertyRequestId, action);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'updatePropertyRequestStatus()', err);
        next(err);
    }
}

export async function getPropertyDocument(req: any, res: Response, next: NextFunction) {
    try {
        const docId = req.params[PathParams.PROPERTY_DOC_ID];
        Log.debug('Logged in User: ', req.userSession);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.getPropertyDocument(docId);
        if (serviceResponse.data) {
            res.download(path.resolve('.' + serviceResponse.data.path));
        } else {
            responseBuilder(serviceResponse, res, next, req);
        }
    } catch (err) {
        Log.error(TAG, 'getPropertyDocument()', err);
        next(err);
    }
}

export async function savePropertyDocumentComment(req: any, res: Response, next: NextFunction) {
    try {
        const docId = req.params[PathParams.PROPERTY_DOC_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('REQUEST BODY: ', req.body);
        const comment: IDocComment = docCommentDataMapping(req.body);
        const serviceResponse: IServiceResponse = await PropertyRequestService.saveDocumentComment(req.userSession,
            docId, comment);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'savePropertyDocumentComment()', err);
        next(err);
    }
}

export async function fetchPropertyDocumentComment(req: any, res: Response, next: NextFunction) {
    try {
        const docId = req.params[PathParams.PROPERTY_DOC_ID];
        Log.debug('Logged in User: ', req.userSession);
        const serviceResponse: IServiceResponse = await PropertyRequestService.getDocumentComment(req.userSession,
            docId);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'fetchPropertyDocumentComment()', err);
        next(err);
    }
}

export async function updatePropertyDocumentComment(req: any, res: Response, next: NextFunction) {
    try {
        const docId = req.params[PathParams.PROPERTY_DOC_ID];
        const commentId = req.params[PathParams.COMMENT_ID];
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('REQUEST BODY: ', req.body);
        const comment: IDocComment = docCommentDataMapping(req.body);
        const serviceResponse: IServiceResponse = await PropertyRequestService.updateDocumentComment(req.userSession,
            docId, commentId, comment);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'updatePropertyDocumentComment()', err);
        next(err);
    }
}

export async function deletePropertyDocumentComment(req: any, res: Response, next: NextFunction) {
    try {
        const docId = req.params[PathParams.PROPERTY_DOC_ID];
        const commentId = req.params[PathParams.COMMENT_ID];
        Log.debug('Logged in User: ', req.userSession);
        const serviceResponse: IServiceResponse = await PropertyRequestService.deleteDocumentComment(req.userSession,
            docId, commentId);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'deletePropertyDocumentComment()', err);
        next(err);
    }
}

export async function updatePropertyRequestFinalReport(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('Logged in User: ', req.userSession);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.updatePropertyRequestFinalReport(req, res);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'updatePropertyRequestFinalReport()', err);
        next(err);
    }
}

export async function sharePropertyRequestFinalReport(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('Logged in User: ', req.userSession);
        const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID];
        Log.debug('REQUEST BODY: ', req.body);
        const serviceResponse: IServiceResponse =
            await PropertyRequestService.shareFinalReport(req.userSession, propertyRequestId, req.body);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'sharePropertyRequestFinalReport()', err);
        next(err);
    }
}
