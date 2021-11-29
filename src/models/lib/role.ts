import {AuditInfo, BaseRecord, BaseRecordAudit, IBaseRecordAudit, IPermission, IUserSession} from 'models';

export interface IRole extends IBaseRecordAudit {
    permissions: IPermission;
}

export class Role extends BaseRecordAudit implements IRole {
    public permissions;

    constructor(loggedInUser: IUserSession, name: string, permissions: IPermission[], id?: string) {
        super(
            id,
            name,
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
        this.permissions = permissions;
    }
}
