import {IBaseRecord, Log} from 'models';
import {MasterData} from 'data_stores/mongo_db';
import {keyBy} from 'lodash';

const TAG = 'data_stores.mongo_db.cache.role';
let rolesList;

export async function fetchPropertyTypes() {
    try {
        const roles = await MasterData.getAllPropertyTypes(1);
        rolesList = keyBy(roles, 'id');
        return;
    } catch (error) {
        Log.error(TAG, 'getPropertyTypeByPropertyTypeName()', error);
        throw error;
    }
}

export async function fetchPropertyTypeById(id: string): Promise<IBaseRecord> {
    try {
        if (!rolesList || !rolesList[id]) {
            await fetchPropertyTypes();
        }
        return rolesList[id];
    } catch (error) {
        Log.error(TAG, 'fetchPropertyTypeById()', error);
        throw error;
    }
}
