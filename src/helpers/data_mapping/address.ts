import {Address, IAddress, IUserSession, Log} from 'models';

const TAG = 'helpers.data_mapping.address';

export function addressDataMapping(loggedInUser: IUserSession, payload: any, id?: string)
    : IAddress {
    try {
        return new Address(payload?.addressLine1,
            payload?.city,
            payload?.state,
            payload?.country,
            payload?.postalCode,
            payload?.district,
            payload?.addressLine2,
            id,
            loggedInUser,
        );
    } catch (error) {
        Log.error(TAG, 'addressDataMapping()', error);
        throw error;
    }
}
