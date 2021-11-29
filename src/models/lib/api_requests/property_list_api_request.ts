import {BaseListAPIRequest, IBaseListAPIRequest} from 'models';

export interface IPropertyRequestListApiRequest extends IBaseListAPIRequest {
    region: string[];
    location: string[];
    propertyType: string[];
    status: string[];
}

export class PropertyRequestListApiRequest extends BaseListAPIRequest implements IPropertyRequestListApiRequest {
    public region: string[];
    public location: string[];
    public propertyType: string[];
    public status: string[];

    constructor(searchText: string, offset?: number, limit?: number, queryId?: string, sortBy?: string,
                sortOrder?: string, status?: string[], region?: string[], location?: string[],
                propertyType?: string[]) {
        super(searchText, offset, limit, queryId, sortBy, sortOrder);
        this.region = region;
        this.location = location;
        this.propertyType = propertyType;
        this.status = status;
    }
}
