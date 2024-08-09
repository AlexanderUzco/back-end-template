export enum UserExceptions {
    NOT_FOUND = 'USER_NOT_FOUND',
    ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    WRONG_PASSWORD = 'Wrong Password',
    EMAIL_REQUIRED = 'Email Required',
    FAILED_UPDATE_BASIC_DATA = 'Failed Update Basic Data',
}

export enum AuthExceptions {
    TOKEN_CREATE_ERROR = 'TOKEN_CREATE_ERROR',
    TOKEN_NOT_FOUND = 'Missing token',
    TOKEN_EXPIRED = 'Token expired',
    TOKEN_INVALID = 'Token invalid',
    PASSWORD_NOT_UPDATED = 'Password Not Updated',
}

export enum DataExceptions {
    BAD_REQUEST = 'Bad Request',
    INVALID_USER_STATUS_UPDATE = 'Invalid user status to update',
    MISSING_USER_ID = 'Missing user id',
    MISSING_INFORMATION = 'Missing information',
    INVALID_USER_ID = 'Invalid user id',
}

export const GeneralExceptions = (module: string, error: string) =>
    `Error in ${module} with error: ${error}`;
