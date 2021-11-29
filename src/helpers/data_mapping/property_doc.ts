import {IBaseRecord, IPropertyDoc, IUserSession, Log, PropertyDoc} from 'models';

const TAG = 'helpers.data_mapping.property_doc';

export function propertyDocDataMapping(propertyRequestId: string,
                                       attachmentType: IBaseRecord,
                                       payload: any,
                                       loggedInUser?: IUserSession): IPropertyDoc {
    try {
        if (!payload) {
            payload = {};
        }
        if (payload?.path) {
            payload.path = payload?.path[0] == '/' ? payload.path : '/' + payload?.path;
        }
        return new PropertyDoc(
            propertyRequestId,
            payload?.key ?? payload?.path ?? payload?.url,
            payload?.originalname,
            payload?.mimetype,
            attachmentType,
        );
    } catch (error) {
        Log.error(TAG, 'propertyDocDataMapping()', error);
        throw error;
    }
}
