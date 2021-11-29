import {IPropertyContact} from 'src/models/lib/property_contact';
import PropertyContact from '../db_models/property_contacts';
import {IBaseListAPIRequest, IUserSession, Log, PropertyDoc} from 'models';
import {findAllRecords, findOneAndDelete} from 'data_stores/mongo_db/helpers/query';
import {propertyContactDataMapping} from 'data_stores/mongo_db/helpers/data_mapping/property_contact';

const TAG = 'data_stores.mongo_db.lib.property_contact';

export async function saveContactMeRequest(loggedInUser: IUserSession, doc: IPropertyContact) {
    try {
        const propertyContact = new PropertyContact({
            property_type_id: doc.propertyType.id ?? null,
            property_type: doc.propertyType?.name ?? null,
            region_id: doc.region?.id ?? null,
            region_name: doc.region?.name ?? null,
            name: doc.name,
            email_id: doc.emailId,
            contact_number: doc.contactNumber,
            c_dt: new Date(),
            c_by: loggedInUser?.userId ?? null,
        });
        const result = await propertyContact.save();
        return propertyContactDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'verifyProperty()', error);
        throw error;
    }
}

export async function getAllPropertyContactMeRequests(loggedInUser: IUserSession, queryParams: IBaseListAPIRequest) {
    try {
        const result = await findAllRecords(PropertyContact, {},
            {
                _id: 1,
                property_type_id: 1,
                property_type: 1,
                region_id: 1,
                region_name: 1,
                name: 1,
                email_id: 1,
                contact_number: 1,
            }, {});
        const contactMe: IPropertyContact[] = [];
        for (const contact of result) {
            contactMe.push(propertyContactDataMapping(contact));
        }
        return contactMe;
    } catch (error) {
        Log.error(TAG, 'getAllPropertyContactMeRequests()', error);
        throw error;
    }
}
