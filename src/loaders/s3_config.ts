import {Log} from 'models';

const AWS = require('aws-sdk');
import {AWS_S3} from './config';
import {S3_STORAGE} from 'constants/app_defaults';

let s3Connection;

export function s3ConnectionLoader() {
    Log.info(`s3Loader()`);
    try {
        if (s3Connection) {
            return s3Connection;
        }
        if (Object.values(AWS_S3).filter((e) => !!e).length >= 5) {
            Log.info('S3 Storage enabled');
            S3_STORAGE.enabled = true;
        }
        Log.debug(`creating AWS connection with config: ${JSON.stringify(AWS_S3)}`);
        AWS.config.update({
            accessKeyId: AWS_S3.accessKeyId,
            secretAccessKey: AWS_S3.secretAccessKey,
            acl: AWS_S3.acl,
            region: AWS_S3.region,
        });
        s3Connection = new AWS.S3();
        return s3Connection;
    } catch (e) {
        Log.error('loaders.s3_config', 'AWSConnection()', e);
    }
}
