import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import {
    AuthExceptions,
    UserExceptions,
} from 'src/common/exceptions/messages.exceptions';
import { BcryptHelper } from 'src/common/helpers/bcrypt.helper';
import { JwtHelper } from 'src/common/helpers/jwt.helper';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { User, UserDocument } from './schemas/users.schema';
import { AccessTokensService } from '../accesstoken/accessTokens.service';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { FindOneByParamsDto } from './dtos/find-one-by-params.dto';
import { DesactivateUserDto } from './dtos/desactivate-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name, EDatabaseName.AUTH)
        private readonly userModel: Model<UserDocument>,
        private readonly accessTokensService: AccessTokensService,
    ) {}

    // Método auxiliar para construir la respuesta de signin
    private buildSigninResponse(user: User, token: string) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        };
    }

    async findOneByEmail(email: string, project = {}): Promise<User | null> {
        return this.userModel.findOne({ email }, project).exec();
    }

    async findOneById(id: Types.ObjectId) {
        const user = await this.userModel
            .findById(id, { _id: 1, name: 1, email: 1, country: 1 })
            .exec();

        return user;
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
                isDeleted: true,
                deteledAt: new Date(),
                reasonSuspended,
            },
        };
        await this.userModel.updateOne(match, update).exec();
        return;
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, name, password } = createUserDto;

        const existUser = await this.findOneByEmail(email);

        if (existUser) throw UserExceptions.ALREADY_EXISTS;

        const hashedPassword = BcryptHelper.generateHash(password);

        const userCreated = await new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        }).save();

        const { _id } = userCreated;

        const { token, expiresIn } = await JwtHelper.generateJWT({
            uid: _id,
            name,
        });

        await this.accessTokensService.create({
            token,
            expiresIn,
            userID: userCreated._id,
        });

        return {
            _id: userCreated._id,
            name: userCreated.name,
            email: userCreated.email,
            token,
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
        // Buscar el usuario por email, seleccionando solo los campos necesarios
        const existUser = await this.findOneByEmail(email, {
            password: 1,
            name: 1,
            email: 1,
            _id: 1,
        });

        // Verificar si el usuario existe
        if (!existUser) throw UserExceptions.NOT_FOUND;

        // Comparar la contraseña
        const isMatch = BcryptHelper.compareHash(password, existUser.password);
        if (!isMatch) throw UserExceptions.WRONG_PASSWORD;

        // Buscar un token de acceso existente
        const existAccessToken = await this.accessTokensService.findByUserId(
            existUser._id,
        );

        // Si existe un token y no ha expirado, devolverlo
        if (existAccessToken) {
            if (
                !JwtHelper.isTokenExpired(
                    existAccessToken.createdAt,
                    existAccessToken.expiresIn,
                )
            ) {
                return this.buildSigninResponse(
                    existUser,
                    existAccessToken.token,
                );
            } else {
                await this.accessTokensService.deleteById(existAccessToken._id);
            }
        }

        // Generar un nuevo JWT
        const { token, expiresIn } = await JwtHelper.generateJWT({
            uid: existUser._id,
            name: existUser.name,
        });

        if (!token) throw AuthExceptions.TOKEN_CREATE_ERROR;

        await this.accessTokensService.create({
            token,
            expiresIn,
            userID: existUser._id,
        });

        return this.buildSigninResponse(existUser, token);
    }

    async signout(userID: Types.ObjectId) {
        const user = await this.findOneById(userID);

        if (!user) throw UserExceptions.NOT_FOUND;

        await this.accessTokensService.deleteByUserId(user._id);

        return {
            message: 'User signout',
        };
    }

    verifyToken(user: AuthUserDto) {
        return user;
    }
}
