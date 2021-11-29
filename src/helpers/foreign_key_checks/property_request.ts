import {APIError, IPropertyRequest, IServiceResponse, Log} from 'models';
import {MasterData} from 'data_stores/mongo_db';
import {ErrorCodes} from 'constants/error_constants';

const TAG = 'helpers.foreign_key_checks';

export async function verifyPropertyRequestForeignKeys(serviceResponse: IServiceResponse, payload: IPropertyRequest) {
    try {
        if (payload?.id) {
            // TODO
        }
        if (payload?.propertyType?.id) {
            const propertyType = await MasterData.getPropertyTypeById(payload?.propertyType?.id);
            if (propertyType) {
                payload.propertyType = propertyType;
            } else {
                serviceResponse.addError(new APIError('Invalid property type!!', ErrorCodes.RESOURCE_NOT_FOUND,
                    'propertyType'));
            }
        }
        if (payload?.region?.id) {
            const region = await MasterData.getRegionById(payload?.region?.id);
            if (region) {
                payload.region = region;
            } else {
                serviceResponse.addError(new APIError('Invalid region!!', ErrorCodes.RESOURCE_NOT_FOUND,
                    'propertyType'));
            }
        }
    } catch (error) {
        Log.error(TAG, 'verifyPropertyRequestForeignKeys()', error);
    }
}
