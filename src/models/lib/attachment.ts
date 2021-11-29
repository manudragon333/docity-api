export interface IAttachment {
    id?: string;
    type?: string;
    path?: string;
    name?: string;
    mimeType?: string;
}

export class Attachment implements IAttachment {
    public id?: string;
    public type?: string;
    public path?: string;
    public name?: string;
    public mimeType?: string;

    constructor(type?: string,
                path?: string,
                name?: string,
                mimeType?: string,
                id?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.path = path;
        this.mimeType = mimeType;
    }
}
