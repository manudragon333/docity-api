import {BaseRecord, IPropertyDoc, IUserSession, Log, PropertyDoc} from 'models';

const TAG = 'dat_stores.mongodb.data_mapping.property_doc';

export function propertyDocDataMapping(payload: any, loggedInUser?: IUserSession): IPropertyDoc {
    try {
        if (!payload) {
            return payload;
        }
        return new PropertyDoc(
            payload?.property_id,
            payload?.path,
            payload?.name,
            payload?.mime_type,
            new BaseRecord(payload?.attachment_type_id, payload?.attachment_type),
            payload?.notes,
            payload?._id,
            payload?.comments,
        );
    } catch (error) {
        Log.error(TAG, 'propertyDocDataMapping()', error);
        throw error;
    }
}
