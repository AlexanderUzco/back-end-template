import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Db uri
const BASE_DB_URI: string = process.env.BASE_DB_URI || '';

//environment
const NODE_ENV: string = process.env.NODE_ENV || 'development';
const PORT: number = parseInt(process.env.PORT || '3020', 10);

//JWT secret
const JWT_SECRET: string = process.env.JWT_SECRET || '';

//JWT expiration
const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '15m';
const JWT_REFRESH_EXPIRATION: string = process.env.JWT_REFRESH_EXPIRATION || '1d';
const REFRESH_MAX_TTL: string = process.env.REFRESH_MAX_TTL || '7d';

export {
    BASE_DB_URI,
    JWT_EXPIRATION,
    JWT_REFRESH_EXPIRATION,
    JWT_SECRET,
    NODE_ENV,
    PORT,
    REFRESH_MAX_TTL
};

