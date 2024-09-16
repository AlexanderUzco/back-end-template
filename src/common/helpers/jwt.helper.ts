import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { JWT_SECRET } from 'src/common/environments';

const jwt = require('jsonwebtoken');

export interface Props {
    uid: Types.ObjectId;
    name?: string;
    email?: string;
}

export interface JwtData {
    token: string;
}

export enum EJwtError {
    TokenExpiredError = 'TokenExpiredError',
    JsonWebTokenError = 'JsonWebTokenError',
    NotBeforeError = 'NotBeforeError',
    Error = 'Error',
}

export class JwtHelper {
    private static readonly EXPIRATION_TIME = '3d';

    private static generateToken(
        payload: Props,
        secret: string,
    ): Promise<JwtData> {
        return new Promise((resolve, reject) => {
            const options = { expiresIn: JwtHelper.EXPIRATION_TIME };
            jwt.sign(
                payload,
                secret,
                options,
                (err: JsonWebTokenError, token: string) => {
                    if (err) {
                        reject({ token: null, error: err.message });
                    } else {
                        resolve({ token });
                    }
                },
            );
        });
    }

    static generateJWT(props: Props): Promise<JwtData> {
        return JwtHelper.generateToken(props, JWT_SECRET);
    }

    static async verifyJWT(token: string) {
        return await JwtHelper.verifyToken(token, JWT_SECRET);
    }

    private static async verifyToken(
        token: string,
        secret: string,
    ): Promise<JwtPayload | JsonWebTokenError> {
        return new Promise((resolve) => {
            jwt.verify(
                token,
                secret,
                (error: JsonWebTokenError, decoded: JwtPayload) => {
                    if (error) {
                        resolve(error);
                    } else {
                        resolve(decoded);
                    }
                },
            );
        });
    }
}
