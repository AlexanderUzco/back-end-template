import { IsString, IsEmail, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { PaginateQuery } from 'src/common/dto/paginate-query.dto';

export class FindUserQuery extends PaginateQuery {
    @IsMongoId()
    @IsOptional()
    readonly _id?: Types.ObjectId;

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
