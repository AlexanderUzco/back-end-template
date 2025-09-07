import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
    @ApiProperty({
        description: 'The name of the workspace',
        example: 'Workspace 1',
    })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({
        description: 'The description of the workspace',
        example: 'Workspace 1 description',
        required: false,
    })
    @IsString()
    @IsOptional()
    readonly description: string;
}
