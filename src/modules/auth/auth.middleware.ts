import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}

    async use(req: any, res: Response, next: NextFunction) {
        try {
            let token = req.headers.authorization;
            token = token?.split(' ')[1];
            const user = await this.authService.initSession(token);
            if (user) {
                req.user = user;
            }
            next();
        } catch (error) {
            console.log({ error });
            throw new UnauthorizedException();
        }
    }
}
