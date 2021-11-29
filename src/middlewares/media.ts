import fs from 'fs';
import multer from 'multer';
import {Log, ServiceResponse} from 'models';
import {HttpStatusCodes} from 'constants/status_codes';
import {responseBuilder} from 'helpers/response_builder';
import {uploadPropertyDocToS3, uploadUserFilesToS3} from 'helpers/s3_media';
import {S3_STORAGE} from 'constants/app_defaults';
import {SAVE_FILES} from 'loaders/config';

export const localFileStorage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const destinationPath = SAVE_FILES;
            fs.mkdir(destinationPath, {
                recursive: true,
            }, (error) => {
                cb(error, destinationPath);
            });
        },
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}_${file.fieldname}_${file.originalname.slice(0, 5)}.${file.originalname.split('.').pop()}`;
            fileName.replace(/\s|,/g, '');
            req.body[file.fieldname] = SAVE_FILES + fileName;
            cb(null, fileName);
        },
    }),
}).any();

export function uploadUserDocuments(req, res, next) {
    if (S3_STORAGE.enabled) {
        uploadUserFilesToS3(req, res, (error) => {
            if (error) {
                Log.error('middlewares.media', 'uploadUserDocuments()', error);
                const serviceResponse = new ServiceResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR,
                    'Failed to save files.', true);
                serviceResponse.addServerError('Failed to save the files due to technical issues!');
                responseBuilder(serviceResponse, res, next, req);
            } else {
                next();
            }
        });
    } else {
        localFileStorage(req, res, (error) => {
            if (error) {
                Log.error('middlewares.media', 'uploadUserDocuments()', error);
                const serviceResponse = new ServiceResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR,
                    'Failed to save files.', true);
                serviceResponse.addServerError('Failed to save the files due to technical issues!');
                responseBuilder(serviceResponse, res, next, req);
            } else {
                next();
            }
        });
    }
}

export function uploadPropertyRequestDocuments(req, res, next) {
    if (S3_STORAGE.enabled) {
        uploadPropertyDocToS3(req, res, (error) => {
            if (error) {
                Log.error('middlewares.media', 'uploadPropertyRequestDocuments()', error);
                const serviceResponse = new ServiceResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR,
                    'Failed to save files.', true);
                serviceResponse.addServerError('Failed to save the files due to technical issues!');
                responseBuilder(serviceResponse, res, next, req);
            } else {
                next();
            }
        });
    } else {
        localFileStorage(req, res, (error) => {
            if (error) {
                Log.error('middlewares.media', 'uploadPropertyRequestDocuments()', error);
                const serviceResponse = new ServiceResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR,
                    'Failed to save files.', true);
                serviceResponse.addServerError('Failed to save the files due to technical issues!');
                responseBuilder(serviceResponse, res, next, req);
            } else {
                next();
            }
        });
    }
}
