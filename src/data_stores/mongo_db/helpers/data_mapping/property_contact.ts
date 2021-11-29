import {IPropertyContact, PropertyContact} from 'src/models/lib/property_contact';
import {BaseRecord, Log} from 'models';

const TAG = 'dat_stores.mongodb.data_mapping.property_contact';

export function propertyContactDataMapping(payload: any): IPropertyContact {
    try {
        if (payload) {
            return new PropertyContact(
                new BaseRecord(payload?.property_type_id, payload?.property_type),
                new BaseRecord(payload?.region_id, payload?.region_name),
                payload?.name,
                payload?.email_id,
                payload?.contact_number,
                payload?._id,
            );
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'PropertyContactDataMapping()', error);
        throw error;
    }
}
