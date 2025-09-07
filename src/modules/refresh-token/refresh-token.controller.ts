import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HandleException } from 'src/common/decorators/handle-exceptio-decorator.decorator';

import { AuthUser } from '../auth/auth.decorator';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { RefreshTokenDto, TokenResponseDto } from '../auth/dtos/refresh-token.dto';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('Refresh Token')
@Controller('refresh-token')
export class RefreshTokenController {
    constructor(private readonly refreshTokenService: RefreshTokenService) {}

    @Post('/')
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    @ApiResponse({
        status: 200,
        description: 'Tokens refreshed successfully',
        type: TokenResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    @HandleException('ERROR REFRESH TOKEN')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return await this.refreshTokenService.refreshToken(refreshTokenDto.refreshToken);
    }

    @Post('revoke')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Revoke current refresh token' })
    @ApiResponse({ status: 200, description: 'Refresh token revoked successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HandleException('ERROR REVOKE TOKEN')
    async revokeToken(@AuthUser() user: AuthUserDto, @Body() refreshTokenDto: RefreshTokenDto) {
        const success = await this.refreshTokenService.revokeByToken(refreshTokenDto.refreshToken);

        if (!success) {
            throw new Error('Refresh token not found or already revoked');
        }

        return {
            message: 'Refresh token revoked successfully',
        };
    }

    @Post('revoke-all')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Revoke all refresh tokens for current user' })
    @ApiResponse({ status: 200, description: 'All refresh tokens revoked successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HandleException('ERROR REVOKE ALL TOKENS')
    async revokeAllTokens(@AuthUser() user: AuthUserDto) {
        const revokedCount = await this.refreshTokenService.revokeByUserId(user._id);

        return {
            message: `Revoked ${revokedCount} refresh tokens`,
            revokedCount,
        };
    }
}
