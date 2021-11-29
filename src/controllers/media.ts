import {Log} from 'models';
import {PathParams} from 'constants/api_params';
import {getFileURL, readFiles} from 'helpers/s3_media';
import {AWS_S3} from 'loaders/config';

const TAG = 'controller.media';

export async function fetchPropertyAttachmentFromS3(req, res, next) {
    try {
        const mediaId = req.params[PathParams.MEDIA_ID];
        const file = await readFiles(mediaId, AWS_S3.docBucket);
        file.on('httpHeaders', function(statusCode, headers) {
            res.set('Content-Length', headers['content-length']);
            res.set('Content-Type', headers['content-type']);
            this.response.httpResponse.createUnbufferedStream()
                .pipe(res);
        }).send();
        // const url = await getFileURL(mediaId, AWS_S3.docBucket);
        // res.send({
        //     path: url,
        // });
    } catch (error) {
        Log.error(TAG, 'fetchPropertyAttachmentFromS3()', error);
        next(error);
    }
}

export async function fetchUserAttachmentFromS3(req, res, next) {
    try {
        // const mediaId = req.params[PathParams.MEDIA_ID];
        // const file = await readFiles(mediaId, AWS_S3.userBucket);
        // file.on('httpHeaders', function(statusCode, headers) {
        //     res.set('Content-Length', headers['content-length']);
        //     res.set('Content-Type', headers['content-type']);
        //     this.response.httpResponse.createUnbufferedStream()
        //         .pipe(res);
        // }).send();
        const mediaId = req.params[PathParams.MEDIA_ID];
        // const file = await readFiles(mediaId, AWS_S3.docBucket);
        // file.on('httpHeaders', function(statusCode, headers) {
        //     res.set('Content-Length', headers['content-length']);
        //     res.set('Content-Type', headers['content-type']);
        //     this.response.httpResponse.createUnbufferedStream()
        //         .pipe(res);
        // }).send();
        const url = await getFileURL(mediaId, AWS_S3.docBucket);
        res.send({
            path: url,
        });
    } catch (error) {
        Log.error(TAG, 'fetchUserAttachmentFromS3()', error);
        next(error);
    }
}
