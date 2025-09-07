import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HandleException } from 'src/common/decorators/handle-exceptio-decorator.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';

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

    @Get('active')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get active refresh tokens for current user' })
    @ApiResponse({ status: 200, description: 'Active tokens retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HandleException('ERROR GET ACTIVE TOKENS')
    async getActiveTokens(@AuthUser() user: AuthUserDto) {
        const tokens = await this.refreshTokenService.getUserActiveTokens(user._id);

        return {
            message: 'Active tokens retrieved successfully',
            data: tokens.map((token) => ({
                id: token._id,
                createdAt: token.createdAt,
                expiresAt: token.expiresAt,
                userAgent: token.userAgent,
                ipAddress: token.ipAddress,
            })),
        };
    }

    @Post('cleanup')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Clean up expired refresh tokens (ADMIN ONLY)' })
    @ApiResponse({ status: 200, description: 'Expired tokens cleaned up successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @HandleException('ERROR CLEANUP TOKENS')
    async cleanupExpiredTokens() {
        const deletedCount = await this.refreshTokenService.deleteExpiredTokens();

        return {
            message: `Cleaned up ${deletedCount} expired tokens`,
            deletedCount,
        };
    }
}
