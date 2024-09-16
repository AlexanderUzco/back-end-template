import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import { BcryptHelper } from 'src/common/helpers/bcrypt.helper';
import { JwtHelper } from 'src/common/helpers/jwt.helper';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { User, UserDocument } from './schemas/users.schema';
import { AccessTokensService } from '../accesstoken/accessTokens.service';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { FindOneByParamsDto } from './dtos/find-one-by-params.dto';
import { DesactivateUserDto } from './dtos/desactivate-user.dto';
import AuthExceptions from 'src/common/exceptions/auth.exceptions';
import UserExceptions from 'src/common/exceptions/user.exception';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name, EDatabaseName.BASE)
        private readonly userModel: Model<UserDocument>,
        private readonly accessTokensService: AccessTokensService,
    ) {}

    private buildSignInResponse(user: User, token: string) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
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
            .findById(id, { _id: 1, name: 1, email: 1, country: 1 })
            .exec();

        return {
            message: 'User found',
            data: user,
        };
    }

    async findOneByParams(params: FindOneByParamsDto) {
        const user = await this.userModel.findOne(params).exec();
        return user;
    }

    async desactivateUser(params: DesactivateUserDto) {
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
            message: 'User desactivated',
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

        const { token } = await JwtHelper.generateJWT({
            uid: _id,
            email,
        });

        await this.accessTokensService.create({
            token,
            userID: userCreated._id,
        });

        return {
            message: 'User created',
            data: this.buildSignInResponse(userCreated, token),
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
        return;
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

        const { token } = await JwtHelper.generateJWT({
            uid: existUser._id,
            name: existUser.name,
        });

        if (!token) throw AuthExceptions.TOKEN_CREATE_ERROR;

        await this.accessTokensService.create({
            token,
            userID: existUser._id,
        });

        return {
            message: 'User signin',
            data: this.buildSignInResponse(existUser, token),
        };
    }

    async signout(userID: Types.ObjectId) {
        const { data: user } = await this.findOneById(userID);

        if (!user) throw UserExceptions.NOT_FOUND;

        await this.accessTokensService.deleteByUserId(user._id);

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
