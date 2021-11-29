import {Application} from 'express';
import {s3ConnectionLoader} from 'loaders/s3_config';
import {loadTemplates} from 'loaders/template';
import initializeRoutes from 'routes';
import {checkEnv} from './config';
import {emailClientLoader} from './email_client';
import serverLoader from './server';
import {Log} from 'models';
import {mongoConnection} from 'data_stores/mongo_db/mongo_database';
import {razorPayClientLoader} from 'loaders/razor_pay';

export async function initializeApp(app: Application) {
    try {
        await checkEnv();
        await mongoConnection();
        serverLoader(app);
        s3ConnectionLoader();
        razorPayClientLoader();
        emailClientLoader();
        loadTemplates();
        initializeRoutes(app);
    } catch (error) {
        Log.error('loaders', 'initializeApp().', error);
        throw error;
    }
}
