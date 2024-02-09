import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

//environment
const NODE_ENV: string = process.env.NODE_ENV || 'development';
const PORT: any = process.env.PORT || 3002;

//JWT secret
const JWT_SECRET: string = process.env.JWT_SECRET || '';

export { NODE_ENV, PORT, JWT_SECRET };
