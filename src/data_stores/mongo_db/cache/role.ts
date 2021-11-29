import {IBaseRecord, Log} from 'models';
import {RoleData} from 'data_stores/mongo_db';
import {keyBy} from 'lodash';

const TAG = 'data_stores.mongo_db.cache.role';
let rolesList;

export async function fetchRoles() {
    try {
        const roles = await RoleData.fetchRoles();
        rolesList = keyBy(roles, 'name');
        return;
    } catch (error) {
        Log.error(TAG, 'getRoleByRoleName()', error);
        throw error;
    }
}

export async function fetchRoleByName(roleName: string): Promise<IBaseRecord> {
    try {
        if (!rolesList || !rolesList[roleName]) {
            await fetchRoles();
        }
        return rolesList[roleName];
    } catch (error) {
        Log.error(TAG, 'getRoleByRoleName()', error);
        throw error;
    }
}
