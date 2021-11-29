import {
    BaseListAPIRequest,
    IBaseListAPIRequest,
    IPropertyRequestListApiRequest, IRegionListApiRequest,
    Log,
    PropertyRequestListApiRequest, RegionListApiRequest
} from 'models';
import {IUserListApiRequest, UserListApiRequest} from 'src/models/lib/api_requests/user_list_api_request';
import {ROLE_LIST, STATUS_LIST} from 'constants/master_data';

const TAG = 'helpers.data_mapping.req_query';

export function reqQueryDataMapping(payload: any): IBaseListAPIRequest {
    try {
        return new BaseListAPIRequest(
            payload.searchText,
            payload.offset,
            payload.limit,
            payload.queryId,
            payload.sortBy,
            payload.sortOrder,
        );
    } catch (error) {
        Log.error(TAG, 'reqQueryDataMapping()', error);
        throw error;
    }
}

export function reqUsersQueryDataMapping(payload: any): IUserListApiRequest {
    try {
        const roles = [];
        if (payload?.roles) {
            for (const role of payload?.roles?.split(',')) {
                if (ROLE_LIST[role]) {
                    roles.push(ROLE_LIST[role].name);
                } else {
                    roles.push(role);
                }
            }
        }
        payload.roles = roles;
        return new UserListApiRequest(
            payload.searchText,
            payload.offset,
            payload.limit,
            payload.queryId,
            payload.sortBy,
            payload.sortOrder,
            payload?.roles,
            payload?.status?.split(',')
        );
    } catch (error) {
        Log.error(TAG, 'reqUsersQueryDataMapping()', error);
        throw error;
    }
}

export function reqPropertyQueryDataMapping(payload: any): IPropertyRequestListApiRequest {
    try {
        return new PropertyRequestListApiRequest(
            payload.searchText,
            payload.offset,
            payload.limit,
            payload.queryId,
            payload.sortBy,
            payload.sortOrder,
            payload?.status?.split(','),
            payload?.region?.split(','),
            payload?.location?.split(','),
            payload?.propertyType?.split(',')
        );
    } catch (error) {
        Log.error(TAG, 'reqPropertyQueryDataMapping()', error);
        throw error;
    }
}

export function reqGetAllRegionsQueryDataMapping(payload: any): IRegionListApiRequest {
    try {
        return new RegionListApiRequest(
            payload.searchText,
            payload.offset,
            payload.limit,
            payload.queryId,
            payload.sortBy,
            payload.sortOrder,
            payload?.propertyTypeId,
        );
    } catch (error) {
        Log.error(TAG, 'reqGetAllRegionsQueryDataMapping()', error);
        throw error;
    }
}
