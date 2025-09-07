import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EDatabaseName } from './common/constants/database.constants';
import { BASE_DB_URI, NODE_ENV } from './common/environments';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspaceModule } from './modules/workspace/worksapce.module';
import { AuthMiddlewareRoutes } from './routerMiddlewares/authMiddleware.route';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${NODE_ENV}`,
        }),
        MongooseModule.forRoot(BASE_DB_URI, {
            connectionName: EDatabaseName.BASE,
        }),
        UsersModule,
        AuthModule,
        RefreshTokenModule,
        WorkspaceModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(...AuthMiddlewareRoutes.excludedRoutes)
            .forRoutes('*');
    }
}
