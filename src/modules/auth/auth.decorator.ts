import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUserDto } from './dtos/auth-user.dto';

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthUserDto => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
