import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthUserDto {
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly _id: string;

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
