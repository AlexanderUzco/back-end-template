import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class FindByEmailDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Type(() => String)
    readonly email: string;
}
