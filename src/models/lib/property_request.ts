import {
    AuditInfo,
    BaseRecord,
    BaseRecordAudit,
    IAttachment,
    IBaseRecord,
    IBaseRecordAudit,
    IUser,
    IUserSession
} from 'models';

export interface IPropertyRequest extends IBaseRecordAudit {
    referenceId: string;
    propertyType: IBaseRecord;
    region: IBaseRecord;
    name: string;
    emailId: string;
    contactNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    latitude?: number;
    longitude?: number;
    documentWriter?: any;
    status?: IBaseRecord;
    civilEngineer?: IUser;
    civilEngineerResponse?: IBaseRecord;
    paymentStatus?: IBaseRecord;
    estimatedFinishDate?: string;
    finalReport?: any;
    propertyRequestId?: string;
}

export class PropertyRequest extends BaseRecordAudit implements IPropertyRequest {
    public referenceId: string;
    public propertyType: IBaseRecord;
    public region: IBaseRecord;
    public name: string;
    public emailId: string;
    public contactNumber: string;
    public address: string;
    public city: string;
    public state: string;
    public pincode: number;
    public latitude?: number;
    public longitude?: number;
    public documentWriter?: any;
    public status?: IBaseRecord;
    public civilEngineer?: IUser;
    public civilEngineerResponse?: IBaseRecord;
    public paymentStatus?: IBaseRecord;
    public estimatedFinishDate?: string;
    public finalReport?: any;
    public propertyRequestId?: string;

    constructor(loggedInUser: IUserSession,
                referenceId: string,
                propertyType: IBaseRecord,
                region: IBaseRecord,
                name: string,
                emailId: string,
                contactNumber: string,
                address: string,
                city: string,
                state: string,
                pincode: number,
                latitude: number,
                longitude: number,
                id?: string,
                documentWriter?: any,
                estimatedFinishDate?: string,
                finalReport?: any,
                status?: IBaseRecord,
                civilEngineer?: IUser,
                civilEngineerResponse?: IBaseRecord,
                paymentStatus?: IBaseRecord,
                propertyRequestId?: string, ) {
        super(
            id,
            null,
            new AuditInfo(
                new BaseRecord(
                    loggedInUser.userId,
                    loggedInUser?.name,
                ),
                new Date(),
                new BaseRecord(
                    loggedInUser.userId,
                    loggedInUser?.name,
                ),
                new Date(),
            )
        );
        this.referenceId = referenceId;
        this.propertyType = propertyType;
        this.region = region;
        this.name = name;
        this.emailId = emailId;
        this.contactNumber = contactNumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.documentWriter = documentWriter;
        this.status = status;
        this.civilEngineer = civilEngineer;
        this.civilEngineerResponse = civilEngineerResponse;
        this.paymentStatus = paymentStatus;
        this.estimatedFinishDate = estimatedFinishDate;
        this.finalReport = finalReport;
        this.propertyRequestId = propertyRequestId;
    }
}
