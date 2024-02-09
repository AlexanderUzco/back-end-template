import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import {
    AccessTokens,
    AccessTokenDocument,
} from './schemas/accessTokens.schema';
import { CreateAccessTokenDto } from './dtos/create-accesstoken.dto';

@Injectable()
export class AccessTokensService {
    constructor(
        @InjectModel(AccessTokens.name, EDatabaseName.AUTH)
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
        const { userID, token, expiresIn } = payload;

        const accessTokenData = new this.accessTokenModel({
            userID,
            token,
            expiresIn,
        });

        const newAccessToken = await accessTokenData.save();

        return newAccessToken;
    }

    async findByUserId(userID: string) {
        const accessToken = await this.accessTokenModel
            .findOne({ userID })
            .exec();
        return accessToken;
    }

    async deleteById(id: string) {
        return this.accessTokenModel.deleteOne({ _id: id });
    }

    async deleteByUserId(userID: string) {
        return this.accessTokenModel.deleteMany({ userID });
    }
}
