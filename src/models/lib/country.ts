import {BaseRecord, IBaseRecord} from 'src/models/lib/base_record';

export interface ICountry extends IBaseRecord {
    code?: string;
    phoneCode?: string;
}

export class Country extends BaseRecord implements ICountry {
    public code?: string;
    public phoneCode: string;

    constructor(id: string, name?: string, code?: string, phoneCode?: string) {
        super(id, name);
        this.code = code;
        this.phoneCode = phoneCode;
    }
}
