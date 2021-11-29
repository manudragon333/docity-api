import {BaseListAPIRequest, IBaseListAPIRequest} from 'models';

export interface IRegionListApiRequest extends IBaseListAPIRequest {
    propertyTypeId: string;
    regionType?: string;
}

export class RegionListApiRequest extends BaseListAPIRequest implements IRegionListApiRequest {
    public propertyTypeId: string;
    public regionType?: string;

    constructor(searchText: string, offset?: number, limit?: number, queryId?: string, sortBy?: string,
                sortOrder?: string, propertyTypeId?: string, regionType?: string) {
        super(searchText, offset, limit, queryId, sortBy, sortOrder);
        this.propertyTypeId = propertyTypeId;
        this.regionType = regionType;
    }
}
