import {Attachment, IAttachment, IBaseRecord} from 'models';
import {IDocComment} from 'src/models/lib/doc_comment';

export interface IPropertyDoc extends IAttachment {
    propertyRequestId: string;
    attachmentType?: IBaseRecord;
    notes?: string;
    comments?: IDocComment[];
}

export class PropertyDoc extends Attachment implements IPropertyDoc {
    public propertyRequestId: string;
    public attachmentType?: IBaseRecord;
    public notes?: string;
    public comments?: IDocComment[];

    constructor(propertyRequestId: string,
                path?: string,
                name?: string,
                mimeType?: string,
                attachmentType?: IBaseRecord,
                notes?: string,
                id?: string,
                comments?: IDocComment[]) {
        super(null,
            path,
            name,
            mimeType,
            id);
        this.propertyRequestId = propertyRequestId;
        this.attachmentType = attachmentType;
        this.notes = notes;
        this.comments = comments;
    }
}
