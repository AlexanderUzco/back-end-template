import { Type } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class DeactivateUserDto {
    @IsMongoId()
    readonly userID: Types.ObjectId;

    @IsString()
    @Type(() => String)
    readonly reasonSuspended: string;
}
