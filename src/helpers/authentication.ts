import jsonwebtoken from 'jsonwebtoken';
import {
    JWT_ACCESS_TOKEN_EXPIRY_TIME,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRY_TIME,
    JWT_REFRESH_TOKEN_SECRET
} from 'loaders/config';
import {Log} from 'models';

const TAG = 'helpers.authentication';

function generateJWT(payload: object, expiresIn: any, secret: string): string {
    return jsonwebtoken.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn,
    });
}

export function generateAccessToken(payload: object, expiresIn: any = JWT_ACCESS_TOKEN_EXPIRY_TIME)
    : string {
    try {
        return generateJWT(payload, expiresIn, JWT_ACCESS_TOKEN_SECRET);
    } catch (e) {
        Log.error(TAG, `generateAccessToken()`, e);
        throw e;
    }
}

export function generateRefreshToken(payload: object, expiresIn: any = JWT_REFRESH_TOKEN_EXPIRY_TIME)
    : string {
    try {
        return generateJWT(payload, expiresIn, JWT_REFRESH_TOKEN_SECRET);
    } catch (e) {
        Log.error(TAG, `generateRefreshToken()`, e);
        throw e;
    }
}

export function verifyAccessToken(token: string): any {
    return jsonwebtoken.verify(token, JWT_ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string): any {
    return jsonwebtoken.verify(token, JWT_REFRESH_TOKEN_SECRET);
}

export function decodeToken(token: string): any {
    return jsonwebtoken.decode(token);
}
