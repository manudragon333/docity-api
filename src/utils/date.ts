import {DateTime} from 'luxon';
import {Log} from 'models';

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
const TAG = 'utils.date';

export function convertDateTimeToMysqlDateTime(date: Date) {
    try {
        function twoDigits(d) {
            if (0 <= d && d < 10) {
                return '0' + d.toString();
            }
            if (-10 < d && d < 0) {
                return '-0' + (-1 * d).toString();
            }
            return d.toString();
        }

        return date.getUTCFullYear() + '-' + twoDigits(1 + date.getUTCMonth()) + '-' + twoDigits(date.getUTCDate())
            + ' ' + twoDigits(date.getUTCHours()) + ':' + twoDigits(date.getUTCMinutes()) + ':'
            + twoDigits(date.getUTCSeconds());
    } catch (error) {
        Log.error(TAG, 'convertDateToMysqlDateTime()', error);
        throw error;
    }
}

export function convertDateToYYYDDMM(date: Date) {
    try {
        function twoDigits(d) {
            if (0 <= d && d < 10) {
                return '0' + d.toString();
            }
            if (-10 < d && d < 0) {
                return '-0' + (-1 * d).toString();
            }
            return d.toString();
        }

        return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
    } catch (error) {
        Log.error(TAG, 'convertDateToYYYDDMM()', error);
        throw error;
    }
}

export function convertDateToLocalString(date: Date): string {
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

export function getDateWithDiff(startDate: string, days: number): string {
    return DateTime.fromISO(startDate).plus({days: days}).toISODate();
}

export function getDaysDiffOfDates(startDate: string, endDate: string): any {
    const date1 = DateTime.fromISO(startDate);
    const date2 = DateTime.fromISO(endDate);

    const diff = date1.diff(date2, ['days']);
    return diff.toObject();

}
