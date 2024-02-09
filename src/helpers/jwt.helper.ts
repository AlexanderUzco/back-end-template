const jwt = require('jsonwebtoken');
import { JWT_SECRET } from 'src/environments';

export interface Props {
    uid: string;
    name: string;
}

export interface JwtData {
    token: string;
    expiresIn: number;
}

export class JwtHelper {
    private static readonly EXPIRATION_TIME = 259200; // 3 days in seconds

    private static generateToken(
        payload: Props,
        secret: string,
    ): Promise<JwtData> {
        return new Promise((resolve, reject) => {
            const options = { expiresIn: JwtHelper.EXPIRATION_TIME };
            jwt.sign(payload, secret, options, (err: any, token: any) => {
                if (err) {
                    console.error(err);
                    reject({ token: null, expiresIn: null });
                } else {
                    resolve({ token, expiresIn: JwtHelper.EXPIRATION_TIME });
                }
            });
        });
    }

    static generateJWT(props: Props): Promise<JwtData> {
        return JwtHelper.generateToken(props, JWT_SECRET);
    }

    static verifyJWT(token: string) {
        return JwtHelper.verifyToken(token, JWT_SECRET);
    }

    private static verifyToken(token: string, secret: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err: any, decoded: any) => {
                if (err) {
                    console.error(err);
                    reject('Invalid token');
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
