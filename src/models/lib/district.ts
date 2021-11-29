import {BaseRecord, IBaseRecord} from 'src/models/lib/base_record';

export interface IDistrict extends IBaseRecord {
    code?: string;
}

export class District extends BaseRecord implements IDistrict {
    public code?: string;

    constructor(id: string, name?: string, code?: string) {
        super(id, name);
        this.code = code;
    }
}
