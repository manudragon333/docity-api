import Axios from 'axios';
import {Log} from 'models';

const TAG = 'helpers.http_client';

export async function requestExternalAPI(httpMethod: string, path: string, headers?: any, body?: any, params?: any):
    Promise<any> {
    Log.info('requestExternalAPI()');
    Log.debug('STARTED requesting External API');
    try {
        if (httpMethod === 'POST') {
            return await Axios.post(path, body, {headers});
        } else if (httpMethod === 'GET') {
            return await Axios.get(path, {headers, params});
        }
    } catch (e) {
        Log.error(TAG, 'requestExternalAPI() ', e);
        throw e;
    }
}
