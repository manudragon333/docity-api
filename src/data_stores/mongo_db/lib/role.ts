import {BaseRecord, IBaseListAPIRequest, IBaseRecord, Log} from 'models';
import {findAllRecords, findOne} from 'data_stores/mongo_db/helpers/query';
import Role from '../db_models/role';

const TAG = 'data_stores.mongo_db.lib.role';

export async function fetchRoles(queryParams?: IBaseListAPIRequest): Promise<IBaseRecord[]> {
    try {
        const result = await findAllRecords(Role, {}, {
            _id: 1,
            nm: 1,
        }, {}, []);
        const roles: IBaseRecord[] = [];
        for (const role of result) {
            roles.push(
                new BaseRecord(role?._id, role?.nm)
            );
        }
        return roles;
    } catch (error) {
        Log.error(TAG, 'fetchRoles()', error);
        throw error;
    }
}

export async function fetchRoleDetails(roleId: string): Promise<IBaseRecord> {
    try {
        const result = await findOne(Role, {
            _id: roleId
        }, {
            _id: 1,
            nm: 1,
        }, {}, []);
        if (result) {
            return new BaseRecord(result?._id, result?.nm);
        } else {
            return result;
        }
    } catch (error) {
        Log.error(TAG, 'fetchRoleDetails()', error);
        throw error;
    }
}
