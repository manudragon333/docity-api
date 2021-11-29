import {IPropertyChat, Log, PropertyChat} from 'models';

const TAG = 'helpers.property_chat';

export function propertyChatDataMapping(payload: any): IPropertyChat {
    try {
        return new PropertyChat(
            payload?.propertyRequestId,
            payload?.senderId,
            payload?.content,
            payload?.attachmentPath,
        );
    } catch (error) {
        Log.error(TAG, 'propertyChatDataMapping()', error);
        throw error;
    }
}
