import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model, Types } from 'mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import AuthExceptions from 'src/common/exceptions/auth.exceptions';
import UserExceptions from 'src/common/exceptions/user.exception';
import { BcryptHelper } from 'src/common/helpers/bcrypt.helper';
import { JwtHelper } from 'src/common/helpers/jwt.helper';
import { paginate } from 'src/utils/paginate.utils';

import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { DeactivateUserDto } from './dtos/deactivate-user.dto';
import { FindUserQuery } from './dtos/find-user-query.dto';
import { SigninDto } from './dtos/signin.dto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name, EDatabaseName.BASE)
        private readonly userModel: Model<UserDocument>,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    private buildSignInResponse(user: User, accessToken: string, refreshToken: string) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken,
        };
    }

    async findOneByEmail(email: string, project = {}) {
        const user = await this.userModel.findOne({ email }, project).exec();

        return {
            message: 'User found',
            data: user,
        };
    }

    async findOneById(id: Types.ObjectId) {
        const user = await this.userModel
            .findById(id, { _id: 1, name: 1, email: 1, country: 1, role: 1 })
            .exec();

        return {
            message: 'User found',
            data: user,
        };
    }

    async findOne(params: FindUserQuery) {
        const user = await this.userModel.findOne(params).exec();
        return {
            message: 'User found',
            data: user,
        };
    }

    async findMany(params: FindUserQuery) {
        const { search } = params;

        const queryValues = {
            ...params,
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            }),
        };

        const { items, meta } = await paginate({
            model: this.userModel,
            queryValues,
            project: { _id: 1, name: 1, email: 1, country: 1, role: 1 },
            options: { sort: { createdAt: -1 } },
        });

        return {
            message: 'User found',
            data: items,
            meta,
        };
    }

    async deactivateUser(params: DeactivateUserDto) {
        const { userID, reasonSuspended } = params;

        const user = await this.findOneById(userID);

        if (!user) throw UserExceptions.NOT_FOUND;

        const match = { _id: userID };

        const update = {
            $set: {
                isSuspended: true,
                deteledAt: new Date(),
                reasonSuspended,
            },
        };
        await this.userModel.updateOne(match, update).exec();

        return {
            message: 'User deactivated',
        };
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        const { data: existUser } = await this.findOneByEmail(email);

        if (existUser) throw UserExceptions.ALREADY_EXISTS;

        const hashedPassword = BcryptHelper.generateHash(password);

        const userCreated = await new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        }).save();

        const { _id } = userCreated;

        const { token: accessToken } = await JwtHelper.generateJWT({
            uid: _id,
            name: userCreated.name,
            email: userCreated.email,
        });

        const jtiSignup = randomUUID();
        const { token: refreshToken, expiresAt } = await JwtHelper.generateRefreshToken({
            uid: _id,
            name: userCreated.name,
            email: userCreated.email,
            jti: jtiSignup,
        });

        await this.refreshTokenService.create(
            _id,
            refreshToken,
            expiresAt,
            undefined,
            undefined,
            undefined,
            jtiSignup,
        );

        return {
            message: 'User created',
            data: this.buildSignInResponse(userCreated, accessToken, refreshToken),
        };
    }

    async updateLastLogin(email: string) {
        const match = { email };
        const update = {
            $set: {
                lastLogin: new Date(),
            },
        };
        await this.userModel.updateOne(match, update).exec();
        return {
            message: 'Last login updated',
        };
    }

    async signin({ email, password }: SigninDto) {
        const { data: existUser } = await this.findOneByEmail(email, {
            password: 1,
            name: 1,
            email: 1,
            _id: 1,
        });

        if (!existUser) throw UserExceptions.NOT_FOUND;

        const isMatch = BcryptHelper.compareHash(password, existUser.password);

        if (!isMatch) throw UserExceptions.WRONG_PASSWORD;

        const { token: accessToken } = await JwtHelper.generateJWT({
            uid: existUser._id,
            name: existUser.name,
            email: existUser.email,
        });

        const jtiSignin = randomUUID();
        const { token: refreshToken, expiresAt } = await JwtHelper.generateRefreshToken({
            uid: existUser._id,
            name: existUser.name,
            email: existUser.email,
            jti: jtiSignin,
        });

        if (!accessToken || !refreshToken) throw AuthExceptions.TOKEN_CREATE_ERROR;

        // Guardar refresh token en la base de datos con firstIssuedAt y jti sincronizados
        await this.refreshTokenService.create(
            existUser._id,
            refreshToken,
            expiresAt,
            undefined,
            undefined,
            undefined,
            jtiSignin,
        );

        return {
            message: 'User signin',
            data: this.buildSignInResponse(existUser, accessToken, refreshToken),
        };
    }

    async signout(userID: Types.ObjectId) {
        const { data: user } = await this.findOneById(userID);

        if (!user) throw UserExceptions.NOT_FOUND;

        // Revocar todos los refresh tokens del usuario
        await this.refreshTokenService.revokeByUserId(user._id);

        return {
            message: 'User signout',
        };
    }

    verifyToken(user: AuthUserDto) {
        return {
            message: 'Token verified',
            data: user,
        };
    }
}
