import mongoose from 'mongoose';
import {Log} from 'models';
import {MONGO_DATABASE} from 'loaders/config';

const TAG = 'data_stores.mongo_db.mongo_database';

const options = {
    poolSize: 16,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};

let connectionEstablished = false;

export async function mongoConnection() {
    try {
        if (connectionEstablished) {
            return;
        }
        Log.info('STARTED Mongo connection initialisation!!!');
        let URL = '';
        if (MONGO_DATABASE?.URL) {
            URL = MONGO_DATABASE?.URL;
        } else {
            URL = `mongodb://${MONGO_DATABASE.address}:${MONGO_DATABASE.port}/${MONGO_DATABASE.name}`;
            if (MONGO_DATABASE?.username?.length && MONGO_DATABASE?.password?.length) {
                URL = `mongodb://${MONGO_DATABASE.username}:${MONGO_DATABASE.password}@${MONGO_DATABASE.address}:${MONGO_DATABASE.port}/${MONGO_DATABASE.name}`;
            }
        }
        Log.debug('CONNECTING DB URL: ', URL);
        await mongoose.connect(URL, options);
        Log.info('Mongo connection initialised successfully!!!');
        connectionEstablished = true;
    } catch (error) {
        Log.error(TAG, 'mongoConnection()', error);
        throw error;
    }
}
