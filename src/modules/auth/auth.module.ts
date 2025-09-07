import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';

@Module({
    imports: [HttpModule, ConfigModule, forwardRef(() => UsersModule)],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
