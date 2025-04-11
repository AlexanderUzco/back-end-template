import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AccessTokenModule } from '../access-token/accessTokens.module';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        forwardRef(() => UsersModule),
        forwardRef(() => AccessTokenModule),
    ],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
