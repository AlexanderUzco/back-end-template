import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EDatabaseName } from './common/constants/database.constants';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AccessTokenModule } from './modules/access-token/accessTokens.module';
import { AuthMiddlewareRoutes } from './routerMiddlewares/authMiddleware.route';
import { BASE_DB_URI, NODE_ENV } from './common/environments';
import { WorkspaceModule } from './modules/workspace/worksapce.module';
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
        AccessTokenModule,
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
