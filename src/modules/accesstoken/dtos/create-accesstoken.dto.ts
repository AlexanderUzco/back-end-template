import { IsString, IsEmail, IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateAccessTokenDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ each: true })
    readonly userID: ObjectId;

    @IsString()
    @IsNotEmpty()
    @Type(() => Number)
    readonly expiresIn: number;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Type(() => String)
    readonly token: string;
}
