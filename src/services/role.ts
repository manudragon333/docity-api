import {IBaseListAPIRequest, IServiceResponse, ListAPIResponse, Log, ServiceResponse} from 'models';
import {HttpStatusCodes} from 'constants/status_codes';
import {RoleData} from 'data_stores/mongo_db';

const TAG = 'services.role';

export async function getRoles(queryParam: IBaseListAPIRequest) {
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK,
        'Successfully fetched roles.', false);
    try {
        const result = await RoleData.fetchRoles(queryParam);
        serviceResponse.data = new ListAPIResponse(result);
    } catch (error) {
        Log.error(TAG, 'getRoles()', error);
    }
    return serviceResponse;
}
