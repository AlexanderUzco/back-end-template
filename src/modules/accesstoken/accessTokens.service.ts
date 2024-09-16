import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import {
    AccessTokens,
    AccessTokenDocument,
} from './schemas/accessTokens.schema';
import { CreateAccessTokenDto } from './dtos/create-accesstoken.dto';

@Injectable()
export class AccessTokensService {
    constructor(
        @InjectModel(AccessTokens.name, EDatabaseName.BASE)
        private readonly accessTokenModel: Model<AccessTokenDocument>,
    ) {}

    async findAll() {
        return await this.accessTokenModel.find().exec();
    }

    async findById(id: string) {
        const accessToken = await this.accessTokenModel.findById(id).exec();
        return accessToken;
    }

    async create(payload: CreateAccessTokenDto) {
        const { userID, token } = payload;

        const accessTokenData = new this.accessTokenModel({
            userID,
            token,
        });

        const newAccessToken = await accessTokenData.save();

        return newAccessToken;
    }

    async findByUserId(userID: Types.ObjectId) {
        const accessToken = await this.accessTokenModel
            .findOne({ userID })
            .exec();
        return accessToken;
    }

    async findByToken(token: string, userID: Types.ObjectId) {
        const accessToken = await this.accessTokenModel
            .findOne({ token, userID })
            .exec();
        return accessToken;
    }

    async deleteById(id: Types.ObjectId) {
        return this.accessTokenModel.deleteOne({ _id: id });
    }

    async deleteByUserId(userID: Types.ObjectId) {
        return this.accessTokenModel.deleteMany({ userID });
    }

    async deleteByToken(token: string) {
        return this.accessTokenModel.deleteOne({ token });
    }
}
