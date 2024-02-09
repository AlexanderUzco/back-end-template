import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SigninDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Type(() => String)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly password: string;
}
