import { Injectable } from '@nestjs/common';
import { EJwtError, JwtHelper } from 'src/common/helpers/jwt.helper';
import { UsersService } from '../users/users.service';
import { AccessTokensService } from '../access-token/accessTokens.service';
import AuthExceptions from 'src/common/exceptions/auth.exceptions';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly accessTokensService: AccessTokensService,
    ) {}

    async initSession(token: string) {
        const decoded = await JwtHelper.verifyJWT(token);

        if (decoded instanceof JsonWebTokenError) {
            if (decoded.name === EJwtError.TokenExpiredError) {
                await this.accessTokensService.deleteByToken(token);
            }
            throw decoded.message;
        }

        const { uid } = decoded;

        const { data: user } = await this.usersService.findOneById(uid);

        if (!user) throw AuthExceptions.UNAUTHORIZED_USER;

        if (user.isSuspended) throw AuthExceptions.USER_SUSPENDED;

        const existAccessToken = await this.accessTokensService.findByToken(
            token,
            user._id,
        );

        if (!existAccessToken) throw AuthExceptions.TOKEN_NOT_FOUND;

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
