import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        description: 'Refresh token to generate new access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class TokenResponseDto {
    @ApiProperty({
        description: 'New access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'New refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    refreshToken: string;

    @ApiProperty({
        description: 'Token expiration time in seconds',
        example: 900,
    })
    expiresIn: number;
}
