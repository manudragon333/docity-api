import {Log} from 'models';
import PropertyChat from '../db_models/property_chat';
import {findOne} from 'data_stores/mongo_db/helpers/query';

const TAG = 'data_stores.mongo_db.lib.property_chat';

export async function findRecord(id: string) {
    Log.info(TAG, 'findPropertyChatRecord()');
    try {
        const data = await findOne(PropertyChat, {
            _id: id
        }, {
            attachment_path: 1
        }, {}, []);
        return data;
    } catch (err) {
        Log.error(TAG, 'getAllPropertyChat()', err);
        throw err;
    }
}
