import {ErrorMessages} from 'constants/error_constants';
import {Log} from 'models';

const TAG = 'utils.string';

export function generateRandomAlphaNumericString(length: number): string {
    const possible = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let str = '';
    for (let i = 0; i < length; ++i) {
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return str;
}

export function generateRandomNumericString(length: number): string {
    const possible = '0123456789';

    let str = '';
    for (let i = 0; i < length; ++i) {
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return str;
}

export function getNumber(input) {
    try {
        if (typeof input != 'number') {
            input = parseInt(input, 10);
        }
    } catch (e) {
        Log.debug('ERROR in getNumber');
        throw e;
    }
    return input;
}

export function getNumberOrDefault(input, defaultValue) {
    try {
        input = getNumber(input);
        input = isNaN(input) ? defaultValue : input;
    } catch (e) {
        Log.debug('Input is not number. Returning Default value');
        return defaultValue;
    }
    return input;
}

export function isNotEmptyArray(arrayObject) {
    try {
        if (arrayObject && Array.isArray(arrayObject) && arrayObject.length > 0) {
            return true;
        }
    } catch (e) {
        Log.debug(e);
    }
    return false;
}

export function checkValidJson(input: string): boolean {
    try {
        JSON.parse(input);
        return true;
    } catch (e) {
        Log.error(TAG, 'toJson()', e);
    }
    return false;
}

export function buildErrorMessage(errorMessage: string, replacer: any): string {
    try {
        if (typeof replacer === 'undefined') {
            replacer = {};
        }
        for (const key of Object.keys(replacer)) {
            errorMessage = errorMessage.replace(key, replacer[key]);
        }
        return errorMessage;
    } catch (error) {
        Log.error(TAG, 'buildErrorMessage()', error);
        throw error;
    }
}

export function getFullName(firstName: string, lastName: string): string {
    return firstName + (lastName ? ' ' + lastName : '');
}
