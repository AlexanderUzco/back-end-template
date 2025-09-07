import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginateQuery } from 'src/common/dto/paginate-query.dto';

export class FindWorkspaceQuery extends PaginateQuery {
    @ApiProperty({
        description: 'The ID of the workspace',
        example: '1234567890',
        required: false,
    })
    @IsOptional()
    readonly _id?: string;

    @ApiProperty({
        description: 'The ID of the owner',
        example: '1234567890',
        required: false,
    })
    @IsOptional()
    readonly ownerID?: string;

    @ApiProperty({
        description: 'The created at of the workspace',
        example: '2021-01-01',
        required: false,
    })
    @IsOptional()
    createdAt?: string;
}
