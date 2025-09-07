import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { JWT_EXPIRATION, JWT_REFRESH_EXPIRATION, JWT_SECRET } from 'src/common/environments';

export interface Props {
    uid: Types.ObjectId;
    name?: string;
    email?: string;
    jti?: string;
}

export interface JwtData {
    token: string;
}

export interface RefreshTokenData {
    token: string;
    expiresAt: Date;
}

export enum EJwtError {
    TokenExpiredError = 'TokenExpiredError',
    JsonWebTokenError = 'JsonWebTokenError',
    NotBeforeError = 'NotBeforeError',
    Error = 'Error',
}

export class JwtHelper {
    private static generateToken(payload: Props, secret: string): Promise<JwtData> {
        return new Promise((resolve, reject) => {
            const options = { expiresIn: JWT_EXPIRATION };
            jwt.sign(payload, secret, options, (err: JsonWebTokenError, token: string) => {
                if (err) {
                    reject({ token: null, error: err.message });
                } else {
                    resolve({ token });
                }
            });
        });
    }

    static generateJWT(props: Props): Promise<JwtData> {
        return JwtHelper.generateToken(props, JWT_SECRET);
    }

    static generateRefreshToken(props: Props): Promise<RefreshTokenData> {
        return new Promise((resolve, reject) => {
            const options = { expiresIn: JWT_REFRESH_EXPIRATION };
            jwt.sign(props, JWT_SECRET, options, (err: JsonWebTokenError, token: string) => {
                if (err) {
                    reject({ token: null, error: err.message });
                } else {
                    const decoded = jwt.decode(token) as { exp: number };
                    resolve({
                        token,
                        expiresAt: new Date(decoded.exp * 1000),
                    });
                }
            });
        });
    }

    static async verifyJWT(token: string) {
        return await JwtHelper.verifyToken(token, JWT_SECRET);
    }

    private static async verifyToken(
        token: string,
        secret: string,
    ): Promise<JwtPayload | JsonWebTokenError> {
        return new Promise((resolve) => {
            jwt.verify(token, secret, (error: JsonWebTokenError, decoded: JwtPayload) => {
                if (error) {
                    console.log(error);
                    resolve(error);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
