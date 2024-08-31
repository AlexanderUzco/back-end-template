import { Injectable } from '@nestjs/common';
import { JwtHelper } from 'src/common/helpers/jwt.helper';
import { UsersService } from '../users/users.service';
import { AccessTokensService } from '../accesstoken/accessTokens.service';
import AuthExceptions from 'src/common/exceptions/auth.exceptions';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly accessTokensService: AccessTokensService,
    ) {}

    async initSession(token: string) {
        const decoded: any = await JwtHelper.verifyJWT(token);

        const { uid } = decoded;

        const user = await this.usersService.findOneById(uid);

        const existAccessToken = await this.accessTokensService.findByUserId(
            user._id,
        );

        if (!existAccessToken) {
            throw AuthExceptions.TOKEN_NOT_FOUND;
        }

        if (
            JwtHelper.isTokenExpired(
                existAccessToken.createdAt,
                existAccessToken.expiresIn,
            )
        ) {
            await this.accessTokensService.deleteByUserId(uid);
            throw AuthExceptions.TOKEN_EXPIRED;
        }

        if (user) {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            };
        }

        return null;
    }
}
