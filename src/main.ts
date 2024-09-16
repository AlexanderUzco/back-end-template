import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from './common/environments';
import { TransformInterceptor } from './common/interceptors/transform.interceptors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    console.log(`Server running on port ${PORT}`);
    await app.listen(PORT);
}
bootstrap();
