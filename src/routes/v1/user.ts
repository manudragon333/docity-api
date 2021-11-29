import * as UserController from 'controllers/user';
import * as UserValidation from 'validations/user';
import {Router} from 'express';
import {isAuthenticated} from 'middlewares/authentication';
import {ROOT, USER_PATHS} from 'constants/api_paths';
import {uploadUserDocuments} from 'middlewares/media';
import {handleUserActionPermission, isSuperAdmin, isSuperAdminOrCivilEngineerorUser} from 'middlewares/permission';

const router = Router();
router.use(isAuthenticated);

router.route(ROOT)
    .post(isSuperAdmin, UserValidation.saveUser, UserController.saveUser)
    .get(isSuperAdmin, UserValidation.getUsers, UserController.getUsers);
router.route(USER_PATHS.USER_INSTANCE)
    .put(isSuperAdmin, UserValidation.updateUser, UserController.updateUser)
    .get(isSuperAdmin, UserValidation.getUser, UserController.getUser);
router.route(USER_PATHS.PROFILE_IMAGE)
    .put(isSuperAdmin, UserValidation.updateProfileImage, UserController.updateProfileImage);
router.route(USER_PATHS.ATTACHMENT)
    .get(isSuperAdmin, UserValidation.doNothing, UserController.getUserIdProofs)
    .post(isSuperAdmin, uploadUserDocuments, UserValidation.addAttachment, UserController.addUserIdProof);
router.route(USER_PATHS.UPDATE_STATUS)
    .put(handleUserActionPermission, UserValidation.handleUserAction, UserController.handleUserAction);
router.route(USER_PATHS.INVITE_USER)
    .post(isSuperAdmin, UserValidation.inviteUser, UserController.inviteUser);
router.route(USER_PATHS.SHARE_REPORT)
    .post(isSuperAdminOrCivilEngineerorUser, UserValidation.shareReport, UserController.shareReport);

export default router;
