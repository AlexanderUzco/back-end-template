import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
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
    @IsNotEmpty()
    @Type(() => String)
    readonly password: string;
}
