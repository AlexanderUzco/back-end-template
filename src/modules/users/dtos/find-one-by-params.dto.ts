import { IsString, IsEmail, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class FindOneByParamsDto {
    @IsMongoId()
    @IsOptional()
    readonly userID?: Types.ObjectId;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly name?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly lastName?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly fullMobile?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    @Type(() => String)
    readonly email?: string;
}
