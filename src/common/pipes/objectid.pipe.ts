import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
    transform(value: string) {
        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException('Invalid ObjectId');
        }
        return new Types.ObjectId(value);
    }
}
