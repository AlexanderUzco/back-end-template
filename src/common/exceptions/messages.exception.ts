export enum DataExceptions {
    BAD_REQUEST = 'BAD_REQUEST',
    INVALID_USER_STATUS_UPDATE = 'INVALID_USER_STATUS_UPDATE',
    MISSING_USER_ID = 'MISSING_USER_ID',
    MISSING_INFORMATION = 'MISSING_INFORMATION',
    INVALID_USER_ID = 'INVALID_USER_ID',
}

export const GeneralExceptions = (module: string, error: string) =>
    `Error in ${module} with error: ${error}`;
