import {BaseRecord} from 'models';

export interface IPermission {
    readPermission: number;
    writePermission: number;
}

export class Permission extends BaseRecord implements IPermission {
    public readPermission: number;
    public writePermission: number;

    constructor(id: string, name: string, readPermission: number, writePermission: number) {
        super(id, name);
        this.readPermission = readPermission;
        this.writePermission = writePermission;
    }
}
