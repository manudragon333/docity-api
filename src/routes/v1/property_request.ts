import {Router} from 'express';
import {PROPERTY_REQUEST} from 'constants/api_paths';
import * as PropertyRequestValidation from 'validations/property_request';
import * as PropertyRequestController from 'controllers/property_request';
import {isAuthenticated} from 'middlewares/authentication';
import {isCivilEngineer, isSuperAdmin, isSuperAdminOrCivilEngineer} from 'middlewares/permission';

const router = Router();
router.route(PROPERTY_REQUEST.CONTACT)
    .post(PropertyRequestValidation.saveContactMeRequest, PropertyRequestController.saveContactMeRequest);

router.use(isAuthenticated);

router.route(PROPERTY_REQUEST.ADD_REQUEST)
    .post(PropertyRequestValidation.saveVerifyProperty, PropertyRequestController.saveVerifyProperty)
    .get(PropertyRequestValidation.getAllPropertyRequests, PropertyRequestController.getAllPropertyRequests)
    .put(PropertyRequestValidation.saveVerifyProperty, PropertyRequestController.updateVerifyPropertyRequest);
router.route(PROPERTY_REQUEST.GET_REQUEST_LOCATIONS)
    .get(PropertyRequestValidation.getAllPropertyRequestLocations, PropertyRequestController.getAllPropertyRequestLocations);
router.route(PROPERTY_REQUEST.PROPERTY_INSTANCE)
    .get(PropertyRequestController.getPropertyRequestDetails);
router.route(PROPERTY_REQUEST.UPDATE_STATUS)
    .put(PropertyRequestValidation.updatePropertyRequestStatus,
        PropertyRequestController.updatePropertyRequestStatus);
router.route(PROPERTY_REQUEST.UPDATE_DOCUMENT_WRITER)
    .put(PropertyRequestValidation.updatePropertyDocumentWriter, PropertyRequestController.updatePropertyDocumentWriter);
router.route(PROPERTY_REQUEST.CONTACT)
    .get(PropertyRequestValidation.getAllPropertyRequests, PropertyRequestController.getAllPropertyContacts);
router.route(PROPERTY_REQUEST.UPLOAD_DOCUMENTS)
    .get(PropertyRequestValidation.getPropertyDocs, PropertyRequestController.getPropertyDocs)
    .post(PropertyRequestValidation.savePropertyDoc, PropertyRequestController.savePropertyDocs);
router.route(PROPERTY_REQUEST.LINK_PROPERTY_DOCUMENTS)
    .post(PropertyRequestValidation.linkPropertyDoc, PropertyRequestController.linkPropertyDoc);
router.route(PROPERTY_REQUEST.DOCUMENT_INSTANCE)
    .get(PropertyRequestValidation.deletePropertyDoc, PropertyRequestController.getPropertyDocument)
    .put(PropertyRequestValidation.updatePropertyDocNotes, PropertyRequestController.updatePropertyDocNotes)
    .delete(PropertyRequestValidation.deletePropertyDoc, PropertyRequestController.deletePropertyDoc);

router.route(PROPERTY_REQUEST.ADD_CIVIL_ENGINEER)
    .post(isSuperAdmin, PropertyRequestValidation.assignCivilEngineerToPropertyRequest,
        PropertyRequestController.assignPropertyRequestToCivilEngineer);
router.route(PROPERTY_REQUEST.UPDATE_CIVIL_ENGINEER_ACTION)
    .put(isCivilEngineer, PropertyRequestValidation.updatePropertyRequestCivilEngineerResponse,
        PropertyRequestController.updatePropertyRequestCivilEngineerResponse);

router.route(PROPERTY_REQUEST.DOCUMENT_COMMENTS)
    .get(PropertyRequestValidation.getDocumentComments, PropertyRequestController.fetchPropertyDocumentComment)
    .post(PropertyRequestValidation.addDocumentComment, PropertyRequestController.savePropertyDocumentComment);
router.route(PROPERTY_REQUEST.DOCUMENT_COMMENT_INSTANCE)
    .put(PropertyRequestValidation.updateDocumentComment, PropertyRequestController.updatePropertyDocumentComment)
    .delete(PropertyRequestValidation.deleteDocumentComment, PropertyRequestController.deletePropertyDocumentComment);

router.route(PROPERTY_REQUEST.UPLOAD_FINAL_REPORT)
    .post(isSuperAdminOrCivilEngineer,
        PropertyRequestValidation.doNothing,
        PropertyRequestController.updatePropertyRequestFinalReport);
router.route(PROPERTY_REQUEST.SHARE_FINAL_REPORT)
    .post(PropertyRequestValidation.shareFinalReport,
        PropertyRequestController.sharePropertyRequestFinalReport);

export default router;
