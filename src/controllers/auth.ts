import {IServiceResponse, IUser, Log} from 'models';
import {NextFunction, Response} from 'express';
import * as AuthService from 'services/auth';
import {responseBuilder} from 'helpers/response_builder';
import {userDataMapping} from 'helpers/data_mapping/user';
import {REDIRECT_URLS} from 'loaders/config';

const TAG = 'controllers.auth';

export async function login(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.login()');
        const serviceResponse: IServiceResponse = await AuthService.loginUser(req.body);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'login()', error);
        next(error);
    }
}

export async function registerUser(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.registerUser()');
        const user: IUser = userDataMapping(req.body);
        const serviceResponse: IServiceResponse = await AuthService.registerUser(user);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'registerUser()', error);
        next(error);
    }
}

export async function forgetPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.forgetPassword()');
        const serviceResponse: IServiceResponse = await AuthService.forgetPassword(req.body);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'forgetPassword()', error);
        next(error);
    }
}

export async function resetPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.resetPassword()');
        const serviceResponse: IServiceResponse = await AuthService.resetPassword(req.body);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'resetPassword()', error);
        next(error);
    }
}

export async function verifyUser(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.verifyUser()');
        const serviceResponse: IServiceResponse = await AuthService.verifyUser(req.query.tk);
        if (!serviceResponse?.errors?.length) {
            res.redirect(REDIRECT_URLS.RIDIRECT_URL + '?type=verify');
        } else {
            responseBuilder(serviceResponse, res, next, req);
        }
    } catch (error) {
        Log.error(TAG, 'verifyUser()', error);
        next(error);
    }
}

export async function verifyInviteUser(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.verifyInviteUser()');
        const serviceResponse: IServiceResponse = await AuthService.verifyInviteUser(req.query.tk);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'verifyInviteUser()', error);
        next(error);
    }
}

export async function resendVerificationLink(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.resendVerificationLink()');
        const serviceResponse: IServiceResponse = await AuthService.resendVerificationLink(req.body.userName);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'resendVerificationLink()', error);
        next(error);
    }
}

export async function saveInvitedUserDetails(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.saveInvitedUserDetails()');
        const user: IUser = userDataMapping(req.body);
        const serviceResponse: IServiceResponse = await AuthService.saveInvitedUserDetails(user, req.body.token);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'saveInvitedUserDetails()', error);
        next(error);
    }
}

export async function refreshSession(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.resendVerificationLink()');
        const serviceResponse: IServiceResponse = await AuthService.refreshSession(req.body.refreshToken);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'resendVerificationLink()', error);
        next(error);
    }
}

export async function checkEmailAlreadyRegistered(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        Log.info(TAG + '.resendVerificationLink()');
        const serviceResponse: IServiceResponse = await AuthService.checkEmailAlreadyRegistered(req.body.emailId);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'resendVerificationLink()', error);
        next(error);
    }
}

