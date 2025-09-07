import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

import { AppModule } from './app.module';
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

    const config = new DocumentBuilder()
        .setTitle('Back End Template API')
        .setDescription(
            'This is the API for the Back End Template. Contains the endpoints for the Back End Template.',
        )
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter token',
            name: 'Authorization',
            in: 'header',
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);

    const theme = new SwaggerTheme();

    const options = {
        explorer: true,
        customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
        jsonDocumentUrl: 'swagger/json',
    };

    SwaggerModule.setup('api', app, document, options);

    console.log(`Server running on port ${PORT}`);
    await app.listen(PORT);
}
bootstrap();
