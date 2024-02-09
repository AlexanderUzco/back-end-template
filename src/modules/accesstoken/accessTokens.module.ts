import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import { AccessTokens, AccessTokenSchema } from './schemas/accessTokens.schema';
import { AccessTokensService } from './accessTokens.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync(
            [
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
    ],
    providers: [AccessTokensService],
    exports: [AccessTokensService],
})
export class AccessTokenModule {}
