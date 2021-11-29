import {APIError, IServiceResponse, IUserSession, Log, ServiceResponse} from 'models';
import {HttpStatusCodes} from 'constants/status_codes';
import {UserData} from 'data_stores/mongo_db';
import {comparePasswords, hashPassword} from 'helpers/encryption';
import {ErrorCodes, ErrorMessages} from 'constants/error_constants';

const TAG = 'services.me';

export async function updateMyPassword(loggedInUser: IUserSession, payload: any) {
    Log.info(TAG + '.updateMyPassword()');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully updated password.', true);
    try {
        const userId: string = loggedInUser.userId;
        const userOldPassword = await UserData.fetchUserPassword(loggedInUser?.userId);
        const matched = await comparePasswords(userOldPassword, payload?.oldPassword);
        const passwordMatched = await comparePasswords(userOldPassword, payload?.newPassword);
        if (passwordMatched) {
            serviceResponse.message = ErrorMessages.PASSWORD_VALIDATION;
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.addError(new APIError(ErrorMessages.PASSWORD_VALIDATION,
                ErrorCodes.VALIDATION_ERROR, 'oldPassword'));
            return serviceResponse;
        }
        if (matched) {
            const password = await hashPassword(payload?.newPassword);
            await UserData.updatePassword(loggedInUser, userId, password);
        } else {
            serviceResponse.message = 'Invalid old password!';
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.addError(new APIError('Invalid old password', ErrorCodes.VALIDATION_ERROR,
                'oldPassword'));
        }
    } catch (error) {
        Log.error(TAG, 'updateMyProfileImage()', error);
        serviceResponse.addServerError('Failed to update the password due to technical issues.');
    }
    return serviceResponse;
}
