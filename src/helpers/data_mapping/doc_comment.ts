import {DocComment, IDocComment} from 'src/models/lib/doc_comment';
import {Log} from 'models';

const TAG = 'helpers.data_mapping.doc_comment';

export function docCommentDataMapping(payload: any): IDocComment {
    try {
        if (payload) {
            const comment = new DocComment(
                payload?.note,
                payload?.type,
                payload?.positionX,
                payload?.positionY,
                payload?.width,
                payload?.height,
                payload?.pageNumber,
            );
            return comment;
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'docCommentDataMapping()', error);
        throw error;
    }
}
