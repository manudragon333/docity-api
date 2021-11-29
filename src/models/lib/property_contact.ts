import {BaseRecord, IBaseRecord} from 'models';

export interface IPropertyContact extends IBaseRecord {
    propertyType: IBaseRecord;
    region: IBaseRecord;
    name: string;
    emailId: string;
    contactNumber: string;
}

export class PropertyContact extends BaseRecord implements IPropertyContact {
    public propertyType: IBaseRecord;
    public region: IBaseRecord;
    public name: string;
    public emailId: string;
    public contactNumber: string;

    constructor(propertyType: IBaseRecord,
                region: IBaseRecord,
                name: string,
                emailId: string,
                contactNumber: string,
                id?: string) {
        super(id);
        this.propertyType = propertyType;
        this.region = region;
        this.name = name;
        this.emailId = emailId;
        this.contactNumber = contactNumber;
    }
}
