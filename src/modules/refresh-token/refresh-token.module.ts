import { forwardRef, Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';

import { UsersModule } from '../users/users.module';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';

@Module({
    imports: [
        MongooseModule.forFeatureAsync(
            [
                {
                    name: RefreshToken.name,
                    useFactory: () => RefreshTokenSchema,
                    inject: [getConnectionToken(EDatabaseName.BASE)],
                },
            ],
            EDatabaseName.BASE,
        ),
        forwardRef(() => UsersModule),
    ],
    controllers: [RefreshTokenController],
    providers: [RefreshTokenService],
    exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
