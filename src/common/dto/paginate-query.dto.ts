import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginateQuery {
    @ApiProperty({
        description: 'The page number',
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => Number(value))
    page?: number;

    @ApiProperty({
        description: 'The limit number',
        example: 10,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => Number(value))
    limit?: number;

    @ApiProperty({
        description: 'The search string',
        example: 'John',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Type(() => String)
    search?: string;
}
