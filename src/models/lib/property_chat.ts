import {BaseRecordAudit, IBaseRecordAudit} from 'models';

export interface IPropertyChat extends IBaseRecordAudit {
    propertyRequestId: string;
    senderId: string;
    content: string;
    attachmentPath: string;
}

export class PropertyChat extends BaseRecordAudit implements IPropertyChat {
    public propertyRequestId: string;
    public senderId: string;
    public content: string;
    public attachmentPath: string;

    constructor(propertyRequestId: string,
                senderId: string,
                content: string,
                attachmentPath: string,
                id?: string) {
        super(id);
        this.propertyRequestId = propertyRequestId;
        this.senderId = senderId;
        this.content = content;
        this.attachmentPath = attachmentPath;
    }

}
