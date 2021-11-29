import * as UserController from 'controllers/me';
import * as UserValidation from 'validations/me';
import {Router} from 'express';
import {isAuthenticated} from 'middlewares/authentication';
import {ME_PATHS, ROOT} from 'constants/api_paths';
import {uploadUserDocuments} from 'middlewares/media';

const router = Router();
router.use(isAuthenticated);

router.route(ROOT)
    .get(UserValidation.doNothing, UserController.getMyProfileDetails)
    .put(UserValidation.updateMyProfileDetails, UserController.updateMyProfileDetails);
router.route(ME_PATHS.RESET_PASSWORD)
    .put(UserValidation.updateMyProfilePassword, UserController.updateMyPassword);
router.route(ME_PATHS.PROFILE_IMAGE)
    .put(UserValidation.doNothing, UserController.updateMyProfileImage);
router.route(ME_PATHS.ATTACHMENT)
    .get(UserValidation.doNothing, UserController.getMyIdProofs)
    .post(uploadUserDocuments, UserValidation.addAttachment, UserController.addMyIdProof);
// router.route(ME_PATHS.UPDATE_ACTIONS)
//     .put(UserValidation.updateActions, UserController.updateUserActions);

export default router;
