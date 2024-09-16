import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(({ data, message, meta }) => {
                return {
                    data,
                    message,
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    meta: meta,
                };
            }),
        );
    }
}
