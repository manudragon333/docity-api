import {DocComment, IDocComment} from 'src/models/lib/doc_comment';
import {BaseRecord, IAuditInfo, Log} from 'models';
import {getFullName} from 'utils/string';

const TAG = 'dat_stores.mongodb.data_mapping.doc_comment';

export function docCommentDataMapping(payload: any): IDocComment {
    try {
        if (payload) {
            const comment = new DocComment(
                payload?.note,
                payload?.type,
                payload?.pos_x,
                payload?.pos_y,
                payload?.width,
                payload?.height,
                payload?.page_nb,
                payload?._id,
            );
            comment.auditInfo = {} as IAuditInfo;
            comment.auditInfo.createdBy = new BaseRecord(payload?.created_by?._id,
                getFullName(payload?.created_by?.f_nm, payload?.created_by?.l_nm));
            comment.auditInfo.lastUpdatedBy = new BaseRecord(payload?.last_updated_by?._id,
                getFullName(payload?.last_updated_by?.f_nm, payload?.last_updated_by?.l_nm));
            comment.auditInfo.creationTime = payload?.created_at;
            comment.auditInfo.lastUpdatedTime = payload?.last_updated_at;
            return comment;
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'docCommentDataMapping()', error);
        throw error;
    }
}
