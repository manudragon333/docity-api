import {AuditInfo, BaseRecord, BaseRecordAudit, IBaseRecord, IBaseRecordAudit} from 'models';

export interface IPayment extends IBaseRecordAudit {
    propertyRequestId: string;
    amount: number;
    transactionId: string;
    rpSignature: string;
    rpOrderId: string;
    paymentMethod: string;
    status: IBaseRecord;
}

export class Payment extends BaseRecordAudit implements IPayment {
    public propertyRequestId: string;
    public amount: number;
    public transactionId: string;
    public rpSignature: string;
    public rpOrderId: string;
    public paymentMethod: string;
    public status: IBaseRecord;

    constructor(propertyRequestId: string,
                amount: number,
                transactionId: string,
                rpSignature: string,
                rpOrderId: string,
                paymentMethod: string,
                status: IBaseRecord,
                userId?: string,
                creationTime?: Date,
                lastUpdatedTime?: Date,
                uname?: string) {
        super(userId, null,
            new AuditInfo(
                new BaseRecord(userId, uname),
                creationTime ?? new Date(),
                new BaseRecord(userId, uname),
                lastUpdatedTime ?? new Date(),
            ));
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.propertyRequestId = propertyRequestId;
        this.status = status;
        this.transactionId = transactionId;
        this.rpSignature = rpSignature;
        this.rpOrderId = rpOrderId;
    }
}
