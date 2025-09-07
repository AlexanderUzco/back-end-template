import { forwardRef, Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';

import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { User, UserSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync(
            [
                {
                    name: User.name,
                    useFactory: () => {
                        const schema = UserSchema;
                        return schema;
                    },
                    inject: [getConnectionToken(EDatabaseName.BASE)],
                },
            ],
            EDatabaseName.BASE,
        ),
        forwardRef(() => RefreshTokenModule),
        forwardRef(() => AuthModule),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
