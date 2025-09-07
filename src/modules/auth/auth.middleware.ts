import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            let token = req.headers.authorization;
            token = token?.split(' ')[1];
            const user = await this.authService.initSession(token);
            if (user) {
                req['user'] = user;
                console.log(req['user']);
            }
            next();
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
