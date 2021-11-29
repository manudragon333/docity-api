import {IPropertyRequest, PropertyRequest} from 'src/models/lib/property_request';
import {BaseRecord, IUser, IUserSession, Log} from 'models';
import {STATUS_LIST} from 'constants/master_data';

const TAG = 'dat_stores.mongodb.data_mapping.property_request';

export function propertyRequestDataMapping(payload: any, loggedInUser?: IUserSession): IPropertyRequest {
    try {
        if (payload) {
            const result = new PropertyRequest(
                {} as IUserSession,
                payload?.reference_id,
                new BaseRecord(payload?.property_type_id ?? null, payload?.property_type ?? null),
                new BaseRecord(payload?.region_id ?? null, payload?.region_name ?? null),
                payload?.name ? payload?.name : payload?.requested_user?.f_nm ?? null,
                payload?.email_id ? payload?.email_id : payload?.requested_user?.email ?? null,
                payload?.contact_number ? payload?.contact_number : payload?.requested_user?.ph_no ?? null,
                payload?.address ?? null,
                payload?.city ?? null,
                payload?.state ?? null,
                payload?.pincode ?? null,
                payload?.latitude ?? null,
                payload?.longitude ?? null,
                payload?._id,
                payload?.document_writer,
                payload?.estimated_finish_date,
                payload?.final_report,
                payload?.propertyRequestId ?? null,
            );
            if (typeof payload.status !== 'undefined') {
                result.status = new BaseRecord(payload.status, STATUS_LIST[payload.status].name);
            }
            if (typeof payload.civil_engineer === 'object') {
                result.civilEngineer = {
                    firstName: payload.civil_engineer?.f_nm,
                    lastName: payload?.civil_engineer?.l_nm,
                    emailId: payload?.civil_engineer?.email,
                    mobileNumber: payload?.civil_engineer?.ph_no,
                } as IUser;
            }
            if (payload?.civil_engineer_response) {
                result.civilEngineerResponse = new BaseRecord(payload?.civil_engineer_response,
                    STATUS_LIST[payload.civil_engineer_response].name);
            }
            if (payload?.payment_status) {
                result.paymentStatus = new BaseRecord(payload?.payment_status,
                    STATUS_LIST[payload.payment_status].name);
            }
            result.auditInfo.creationTime = payload?.c_dt;
            result.auditInfo.lastUpdatedTime = payload?.m_dt;
            return result;
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'PropertyRequestDataMapping()', error);
        throw error;
    }
}
