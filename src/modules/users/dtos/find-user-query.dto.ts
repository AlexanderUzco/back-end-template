import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginateQuery } from 'src/common/dto/paginate-query.dto';

export class FindUserQuery extends PaginateQuery {
    @ApiProperty({
        description: 'The ID of the user',
        example: '1234567890',
        required: false,
    })
    @IsOptional()
    readonly _id?: string;
}
