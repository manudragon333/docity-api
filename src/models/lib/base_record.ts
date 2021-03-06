export interface IBaseRecord {
    description?: string;
    name?: string;
    id?: string;
    additionalProp1?: any;
}

export class BaseRecord implements IBaseRecord {
    public name?: string;
    public id?: string;
    public description?: string;
    public additionalProp1?: any;

    constructor(id?: string, name?: string, description?: string, additionalProp1?: any) {
        this.id = id?.toString();
        this.name = name;
        this.description = description;
        this.additionalProp1 = additionalProp1;
    }
}
