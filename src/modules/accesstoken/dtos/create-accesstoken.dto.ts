import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateAccessTokenDto {
    @IsString()
    @Type(() => Types.ObjectId)
    readonly userID: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Type(() => String)
    readonly token: string;
}
