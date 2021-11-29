export interface IUserSession {
    userId: string;
    role: any[];
    permissions: string[];
    name?: string;
}

export class UserSession implements IUserSession {
    public userId: string;
    public role: any[];
    public permissions: string[];
    public name?: string;

    constructor(userId: string, role: any[], permissions?: string[], name?: string) {
        this.userId = userId ?? null;
        this.role = role ?? [];
        this.permissions = permissions ?? [];
        this.name = name;
    }
}
