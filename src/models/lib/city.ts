import {BaseRecord, IBaseRecord} from 'src/models/lib/base_record';

export interface ICity extends IBaseRecord {
    code?: string;
}

export class City extends BaseRecord implements ICity {
    public code?: string;

    constructor(id: string, name?: string, code?: string) {
        super(id, name);
        this.code = code;
    }
}
