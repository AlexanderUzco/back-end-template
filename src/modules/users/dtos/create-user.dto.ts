import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John',
    })
    @IsString()
    @Type(() => String)
    readonly name: string;

    @ApiProperty({
        description: 'The last name of the user',
        example: 'Doe',
    })
    @IsString()
    @Type(() => String)
    readonly lastName: string;

    @ApiProperty({
        description: 'The country code of the user',
        example: '+57',
    })
    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly countryCode: string;

    @ApiProperty({
        description: 'The mobile of the user',
        example: '3178901234',
    })
    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly mobile: string;

    @ApiProperty({
        description: 'The full mobile of the user',
        example: '+573178901234',
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly fullMobile: string;

    @ApiProperty({
        description: 'The country of the user',
        example: 'Colombia',
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly country: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Type(() => String)
    readonly email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: '123456',
    })
    @IsString()
    @Type(() => String)
    readonly password?: string;

    @ApiProperty({
        description: 'The origin of the user',
        example: 'google',
    })
    @IsString()
    @Type(() => String)
    readonly origin: string;
}
