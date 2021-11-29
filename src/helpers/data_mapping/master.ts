import {BaseRecord, IBaseRecord, Log} from 'models';

const TAG = 'helpers.data_mapping.master';

export function BaseMasterDataMapping(payload: any, id?: string): IBaseRecord {
    try {
        return new BaseRecord(id, payload?.name, payload?.description);
    } catch (error) {
        Log.error(TAG, 'BaseMasterDataMapping()', error);
        throw error;
    }
}
