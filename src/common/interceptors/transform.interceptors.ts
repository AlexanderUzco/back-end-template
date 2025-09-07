import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<unknown>,
    ): Observable<unknown> | Promise<Observable<unknown>> {
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
