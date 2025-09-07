import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import AuthExceptions from 'src/common/exceptions/auth.exceptions';
import { JwtHelper } from 'src/common/helpers/jwt.helper';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async initSession(token: string) {
        const decoded = await JwtHelper.verifyJWT(token);

        if (decoded instanceof JsonWebTokenError) {
            throw decoded.message;
        }

        const { uid } = decoded;

        const { data: user } = await this.usersService.findOneById(uid);

        if (!user) throw AuthExceptions.UNAUTHORIZED_USER;

        if (user.isSuspended) throw AuthExceptions.USER_SUSPENDED;

        if (user) {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            };
        }

        return null;
    }
}
