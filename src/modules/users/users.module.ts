import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import { User, UserSchema } from './schemas/users.schema';
import { UsersController } from './users,controller';
import { UsersService } from './users.service';
import {
    AccessTokens,
    AccessTokenSchema,
} from '../accesstoken/schemas/accessTokens.schema';
import { AccessTokenModule } from '../accesstoken/accessTokens.module';

@Module({
    imports: [
        MongooseModule.forFeatureAsync(
            [
                {
                    name: User.name,
                    useFactory: () => {
                        const schema = UserSchema;
                        schema.plugin(require('mongoose-autopopulate'));
                        return schema;
                    },
                    inject: [getConnectionToken(EDatabaseName.AUTH)],
                },
                {
                    name: AccessTokens.name,
                    useFactory: () => {
                        const schema = AccessTokenSchema;
                        schema.plugin(require('mongoose-autopopulate'));
                        return schema;
                    },
                    inject: [getConnectionToken(EDatabaseName.AUTH)],
                },
            ],
            EDatabaseName.AUTH,
        ),
        AccessTokenModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
