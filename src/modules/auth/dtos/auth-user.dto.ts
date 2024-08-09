import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class AuthUserDto {
    @IsString()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    readonly _id: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly token: string;
}
