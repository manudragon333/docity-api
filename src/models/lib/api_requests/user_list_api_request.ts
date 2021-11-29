import {BaseListAPIRequest, IBaseListAPIRequest} from 'models';

export interface IUserListApiRequest extends IBaseListAPIRequest {
    roles: string[];
    status: string[];
}

export class UserListApiRequest extends BaseListAPIRequest implements IUserListApiRequest {
    public roles: string[];
    public status: string[];

    constructor(searchText: string, offset?: number, limit?: number, queryId?: string, sortBy?: string,
                sortOrder?: string, roles?: string[], status?: string[]) {
        super(searchText, offset, limit, queryId, sortBy, sortOrder);
        this.roles = roles;
        this.status = status;
    }
}
