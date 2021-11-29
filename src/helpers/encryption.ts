import bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import {AES_ENC_KEY, AES_IV} from 'loaders/config';
import {Log} from 'models';

export async function hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 5);
}

export async function comparePasswords(hashedPassword: string, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export function decryptString(encrypted: string): string {
    return CryptoJS.AES.decrypt(encrypted, AES_ENC_KEY, {}).toString(CryptoJS.enc.Utf8);
}

export function encryptString(data): string {
    Log.debug('ENCRYPTION DATA: ', data);
    return CryptoJS.AES.encrypt(data, AES_ENC_KEY).toString();
}
