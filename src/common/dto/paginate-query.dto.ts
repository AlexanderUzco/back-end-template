import { IsOptional, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PaginateQuery {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => Number(value))
    page?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => Number(value))
    limit?: number;
}
