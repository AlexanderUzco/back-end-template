import { IsString, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class DesactivateUserDto {
    @IsMongoId()
    readonly userID: Types.ObjectId;

    @IsString()
    @Type(() => String)
    readonly reasonSuspended: string;
}
