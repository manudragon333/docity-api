import {AUTHENTICATION} from 'constants/app_defaults';
import {ErrorCodes, ErrorMessages} from 'constants/error_constants';
import {HttpStatusCodes} from 'constants/status_codes';
import {NextFunction, Response} from 'express';
import {generateAccessToken, verifyAccessToken} from 'helpers/authentication';
import {responseBuilder} from 'helpers/response_builder';
import {APIError, Log, ServiceResponse, UserSession} from 'models';
import * as nodeUtil from 'util';

export function isAuthenticated(req: any, res: Response, next: NextFunction): void {
    if (AUTHENTICATION.enabled) {
        Log.info('isAuthenticated()');
        let token = null;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }
        try {
            if (!token) {
                Log.debug('TOKEN is missing!');
                const response = new ServiceResponse(HttpStatusCodes.UNAUTHORIZED, 'Token Required.', null, true,
                    [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]);
                return responseBuilder(response, res, next, req);
            }
            const decode: any = verifyAccessToken(token);
            const diffMs = (new Date(decode.exp * 1000).getTime() - new Date().getTime()) / 1000;
            const diffMins = diffMs / 60;
            if (diffMins <= 5) {
                res.set('accessToken', generateAccessToken({
                    userId: decode?.id,
                    role: decode.role,
                    name: decode.name
                }));
            }
            req.userSession = new UserSession(decode.userId, decode.role, [], decode.name);
            Log.debug('LOGGED IN USER:' + nodeUtil.inspect(req.userSession));
            next();
        } catch (error) {
            Log.error('middlewares.authentication', 'isAuthenticated() ', error);
            let response = new ServiceResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR,
                ErrorMessages.INTERNAL_SERVER_ERROR, true);
            response.addServerError('Failed to authenticate user.');
            if (error?.message === 'jwt expired') {
                response = new ServiceResponse(HttpStatusCodes.UNAUTHORIZED,
                    ErrorMessages.SESSION_EXPIRED, true);
                response.addError(new APIError('Token expired!!.', ErrorCodes.UNAUTHORIZED, 'jwtToken'));
            }
            return responseBuilder(response, res, next, req);
        }
    } else {
        Log.debug('Authentication is disabled!!!');
        next();
    }
}
