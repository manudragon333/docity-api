import {IPropertyContact, PropertyContact} from 'src/models/lib/property_contact';
import {BaseRecord, Log} from 'models';

const TAG = 'heplers.data_mapping.property_contact';

export function propertyContactDataMapping(payload: any): IPropertyContact {
    try {
        if (payload) {
            const propertyContact = new PropertyContact(
                payload?.propertyType,
                payload?.region,
                payload?.name,
                payload?.emailId,
                payload?.contactNumber
            );
            return propertyContact;
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'propertyContactDataMapping()', error);
        throw error;
    }
}
