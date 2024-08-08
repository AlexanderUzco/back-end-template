import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccessTokenDto {
    @IsString()
    readonly userID: string;

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
