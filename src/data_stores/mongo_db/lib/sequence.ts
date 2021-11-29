import {Log} from 'models';
import {findOneAndUpdate} from 'data_stores/mongo_db/helpers/query';
import SequenceNumber from '../db_models/sequence_nbs';
import {MAX_SEQUENCE} from 'constants/app_defaults';

const TAG = 'data_stores.mongo_db.lib.sequence';

export async function updateSequenceSeries(type: string, previousSeries: string,
                                           defaultSeries?: string): Promise<any> {
    try {
        let nextSeries = defaultSeries ?? 'DCA';
        if (previousSeries) {
            nextSeries = previousSeries.slice(0, previousSeries.length - 1) +
                String.fromCharCode(previousSeries.charCodeAt(previousSeries.length - 1) + 1);
        }
        const result = await findOneAndUpdate(SequenceNumber, {
            name: type,
        }, {
            series: nextSeries,
            nb: 1,
            name: type,
        }, {
            new: true,
            upsert: true,
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'updateSequenceSeries()', error);
        throw error;
    }
}

export async function fetchAndUpdateLatestSequenceNumber(type: string, defaultSeries?: string): Promise<any> {
    try {
        const result: any = await findOneAndUpdate(SequenceNumber, {
            name: type,
        }, {
            $inc: {
                nb: 1,
            }
        }, {
            new: true,
        });
        if (!result || result?.nb > MAX_SEQUENCE) {
            return updateSequenceSeries(type, result?.series, defaultSeries);
        }
        return result;
    } catch (error) {
        Log.error(TAG, 'fetchLatestSequenceNumber()', error);
        throw error;
    }
}
