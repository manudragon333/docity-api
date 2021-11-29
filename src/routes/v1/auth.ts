import * as AuthController from 'controllers/auth';
import * as AuthValidation from 'validations/auth';
import {Router} from 'express';
import {AUTH_PATHS} from 'constants/api_paths';

const router = Router();
router.route(AUTH_PATHS.LOGIN)
    .post(AuthValidation.login, AuthController.login);
router.route(AUTH_PATHS.REGISTER)
    .post(AuthValidation.registerUser, AuthController.registerUser);
router.route(AUTH_PATHS.FORGET_PASSWORD)
    .post(AuthValidation.forgetPassword, AuthController.forgetPassword);
router.route(AUTH_PATHS.RESET_PASSWORD)
    .put(AuthValidation.resetPassword, AuthController.resetPassword);
router.route(AUTH_PATHS.VERIFY_USER)
    .get(AuthValidation.verifyUser, AuthController.verifyUser);
router.route(AUTH_PATHS.RESEND_VERIFY_LINK)
    .post(AuthValidation.resendVerificationLink, AuthController.resendVerificationLink);
router.route(AUTH_PATHS.VERIFY_INVITE_USER_TOKEN)
    .get(AuthValidation.verifyUser, AuthController.verifyInviteUser);
router.route(AUTH_PATHS.SAVE_INVITE_USER_DETAILS)
    .post(AuthValidation.saveInvitedUserDetails, AuthController.saveInvitedUserDetails);
router.route(AUTH_PATHS.REFRESH_SESSION)
    .post(AuthValidation.refreshSession, AuthController.refreshSession);
router.route(AUTH_PATHS.VALIDATE_EMAIL)
    .post(AuthValidation.checkEmailAlreadyRegistered, AuthController.checkEmailAlreadyRegistered);

export default router;
