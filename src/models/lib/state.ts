import {BaseRecord, IBaseRecord} from 'src/models/lib/base_record';

export interface IState extends IBaseRecord {
    code?: string;
}

export class State extends BaseRecord implements IState {
    public code?: string;

    constructor(id: string, name?: string, code?: string) {
        super(id, name);
        this.code = code;
    }
}
