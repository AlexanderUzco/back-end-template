import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @IsString()
    @Type(() => String)
    readonly name: string;

    @IsString()
    @Type(() => String)
    readonly lastName: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly countryCode: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly mobile: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly fullMobile: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly country: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Type(() => String)
    readonly email: string;

    @IsString()
    @Type(() => String)
    readonly password?: string;

    @IsString()
    @Type(() => String)
    readonly origin: string;
}
