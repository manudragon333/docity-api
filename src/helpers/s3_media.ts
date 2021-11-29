import {s3ConnectionLoader} from 'loaders/s3_config';
import {Log} from 'models';
import multerS3 from 'multer-s3';
import multer from 'multer';
import {API_URL, AWS_S3} from 'loaders/config';
import {PathParams} from 'constants/api_params';
import {S3_STORAGE} from 'constants/app_defaults';
import {localFileStorage} from 'middlewares/media';

const TAG = 'helpers.s3_media';

export const uploadUserFilesToS3 = multer({
    storage: multerS3({
        s3: s3ConnectionLoader(),
        bucket: AWS_S3.userBucket,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        contentType: (req, file, cb) => {
            cb(null, file.mimetype);
        },
        key: (req: any, file, cb) => {
            const userId = req.params[PathParams.USER_ID] ?? req.userSession.userId ?? '';
            req.body[file.fieldname] = Date.now().toString() + userId;
            cb(null, Date.now().toString() + userId + '.' + file.mimetype.split('/')[1]);
        }
    })
}).any();

export const uploadPropertyDocToS3 = multer({
    storage: multerS3({
        s3: s3ConnectionLoader(),
        bucket: AWS_S3.docBucket,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        contentType: (req, file, cb) => {
            cb(null, file.mimetype);
        },
        key: (req: any, file, cb) => {
            const propertyRequestId = req.params[PathParams.PROPERTY_REQUEST_ID] ?? '';
            req.body[file.fieldname] = Date.now().toString() + propertyRequestId;
            cb(null, Date.now().toString() + propertyRequestId + '.' + file.mimetype.split('/')[1]);
        }
    })
}).any();

export const uploadUserProfileImageToS3 = multer({
    storage: multerS3({
        s3: s3ConnectionLoader(),
        bucket: AWS_S3.userBucket,
        acl: 'public-read',
        metadata: (req: any, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        contentType: (req, file, cb) => {
            cb(null, file.mimetype);
        },
        key: (req: any, file, cb) => {
            const userId = req.params[PathParams.USER_ID] ?? req.userSession.userId ?? '';
            cb(null, 'profile_image_' + Date.now() + userId + '.' + file.mimetype.split('/')[1]);
        }
    })
}).any();

export async function saveFiles(req, res, bucketName: string, isProfileImage = false): Promise<any> {
    Log.info('saveFiles()', bucketName);
    return new Promise((resolve, reject) => {
        if (S3_STORAGE.enabled) {
            switch (bucketName) {
                case AWS_S3.userBucket:
                    if (isProfileImage) {
                        uploadUserProfileImageToS3(req, res, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(req);
                            }
                        });
                    } else {
                        uploadUserFilesToS3(req, res, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(req);
                            }
                        });
                    }
                    break;
                case AWS_S3.docBucket:
                    uploadPropertyDocToS3(req, res, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(req);
                        }
                    });
                    break;
            }
        } else {
            localFileStorage(req, res, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(req);
                }
            });
        }
    });
}

export async function readFiles(fileName: string, bucketName?: string) {
    Log.info('readFiles()');
    Log.debug('STARTED file reading from S3');
    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
        };
        const s3Connection = await s3ConnectionLoader();
        const file: any = await s3Connection.getObject(params);
        return file;
    } catch (e) {
        Log.error(TAG, 'readFiles() ', e);
        throw e;
    }
}

export async function getFileURL(fileName: string, bucketName?: string) {
    Log.info('getFileURL()');
    Log.debug('STARTED file reading from S3');
    try {
        if (S3_STORAGE.enabled) {
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Expires: 604800,
            };
            const s3Connection = await s3ConnectionLoader();
            const file: any = await s3Connection.getSignedUrl('getObject', params);
            return file;
        } else {
            return API_URL + fileName;
        }
    } catch (e) {
        Log.error(TAG, 'getFileURL() ', e);
        throw e;
    }
}

export async function deleteS3File(fileName: string, bucketName: string) {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
        };
        const s3Connection = await s3ConnectionLoader();
        return await s3Connection.deleteObject(params).promise();
    } catch (error) {
        Log.error(TAG, 'deleteS3File() ', error);
        throw error;
    }
}
