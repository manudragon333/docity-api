import {IPropertyRequest, PropertyRequest, IUserSession, Log, BaseRecord} from 'models';

const TAG = 'heplers.data_mapping.property_request';

export function propertyRequestDataMapping(payload: any, loggedInUser?: IUserSession): IPropertyRequest {
    try {
        if (payload) {
            if (!loggedInUser) {
                loggedInUser = {} as IUserSession;
            }
            const propertyRequest = new PropertyRequest(
                loggedInUser,
                payload?.referenceId,
                payload?.propertyType,
                payload?.region,
                payload?.name,
                payload?.emailId,
                payload?.contactNumber,
                payload?.address,
                payload?.city,
                payload?.state,
                payload?.pincode,
                payload?.latitude,
                payload?.longitude,
                payload?.propertyRequestId,
            );
            return propertyRequest;
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'propertyRequestDataMapping()', error);
        throw error;
    }
}
