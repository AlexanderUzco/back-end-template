import 'reflect-metadata';

import { HttpException, HttpStatus } from '@nestjs/common';

export function HandleException(errorMessage: string): MethodDecorator {
    return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const originalMethod: (...args: unknown[]) => unknown = descriptor.value;
        const namedWrapper: (...args: unknown[]) => Promise<unknown> = {
            [originalMethod.name]: async function (this: unknown, ...args: unknown[]) {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error: unknown) {
                    throw new HttpException(
                        {
                            status: HttpStatus.FORBIDDEN,
                            error:
                                (error as { message?: string })?.message ||
                                (error as string) ||
                                errorMessage,
                        },
                        HttpStatus.FORBIDDEN,
                        {
                            cause:
                                (error as { message?: string })?.message ||
                                (error as string) ||
                                errorMessage,
                        },
                    );
                }
            },
        }[originalMethod.name];

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const metadataKeys: any[] = Reflect.getMetadataKeys(originalMethod);
            for (const key of metadataKeys) {
                const metaValue: unknown = Reflect.getMetadata(key, originalMethod);
                Reflect.defineMetadata(key, metaValue, namedWrapper);
            }
        } catch {}

        descriptor.value = namedWrapper;
        return descriptor;
    };
}
