import {BaseRecord, IAuditInfo, IPropertyChat, Log, PropertyChat} from 'models';
import {getFullName} from 'utils/string';

const TAG = 'data_stores.mongo_db.helpers.property_chat';

export function propertyChatDataMapping(payload: any): IPropertyChat {
    try {
        if (payload) {
            const message = new PropertyChat(
                payload?.property_request_id,
                payload?.sender?._id,
                payload?.content,
                payload?.attachment_path,
                payload?._id,
            );
            message.auditInfo = {} as IAuditInfo;
            message.auditInfo.creationTime = payload?.created_at;
            message.auditInfo.createdBy = new BaseRecord(payload?.sender?._id, getFullName(payload?.sender?.f_nm,
                payload?.sender?.l_nm), '', {
                profileImage: payload?.pic,
            });
            return message;
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'propertyChatDataMapping()', error);
        throw error;
    }
}
