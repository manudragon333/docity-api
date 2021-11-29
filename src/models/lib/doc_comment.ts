import {BaseRecordAudit, IBaseRecordAudit} from 'models';

export interface IDocComment extends IBaseRecordAudit {
    note: string;
    type: string;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    pageNumber: number;
    id: string;
}

export class DocComment extends BaseRecordAudit implements IDocComment {
    public note: string;
    public type: string;
    public positionX: number;
    public positionY: number;
    public width: number;
    public height: number;
    public pageNumber: number;
    public id: string;

    constructor(note: string,
                type: string,
                positionX: number,
                positionY: number,
                width: number,
                height: number,
                pageNumber: number,
                id?: string) {
        super(id);
        this.note = note;
        this.type = type;
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.pageNumber = pageNumber;
        this.id = id;
    }
}
