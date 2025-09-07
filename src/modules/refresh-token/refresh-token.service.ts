import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model, Types } from 'mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import { REFRESH_MAX_TTL } from 'src/common/environments';
import { JwtHelper } from 'src/common/helpers/jwt.helper';

import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectModel(RefreshToken.name, EDatabaseName.BASE)
        private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    ) {}

    async create(
        userID: Types.ObjectId,
        token: string,
        expiresAt: Date,
        userAgent?: string,
        ipAddress?: string,
        firstIssuedAt?: Date,
        jti?: string,
    ): Promise<RefreshTokenDocument> {
        const refreshToken = new this.refreshTokenModel({
            userID,
            token,
            expiresAt,
            userAgent,
            ipAddress,
            firstIssuedAt: firstIssuedAt ?? new Date(),
            jti: jti ?? randomUUID(),
        });

        return await refreshToken.save();
    }

    async findByToken(token: string): Promise<RefreshTokenDocument | null> {
        return await this.refreshTokenModel
            .findOne({ token, isRevoked: false })
            .populate('userID', 'name email role isSuspended')
            .exec();
    }

    async revokeByToken(token: string): Promise<boolean> {
        const result = await this.refreshTokenModel
            .updateOne(
                { token, isRevoked: false },
                {
                    isRevoked: true,
                    revokedAt: new Date(),
                },
            )
            .exec();

        return result.modifiedCount > 0;
    }

    async revokeByUserId(userId: Types.ObjectId): Promise<number> {
        const result = await this.refreshTokenModel
            .updateMany(
                { userID: userId, isRevoked: false },
                {
                    isRevoked: true,
                    revokedAt: new Date(),
                },
            )
            .exec();

        return result.modifiedCount;
    }

    async revokeAllExpired(): Promise<number> {
        const result = await this.refreshTokenModel
            .updateMany(
                {
                    expiresAt: { $lt: new Date() },
                    isRevoked: false,
                },
                {
                    isRevoked: true,
                    revokedAt: new Date(),
                },
            )
            .exec();

        return result.modifiedCount;
    }

    async deleteExpiredTokens(): Promise<number> {
        const result = await this.refreshTokenModel
            .deleteMany({
                expiresAt: { $lt: new Date() },
            })
            .exec();

        return result.deletedCount;
    }

    async getUserActiveTokens(userId: Types.ObjectId): Promise<RefreshTokenDocument[]> {
        return await this.refreshTokenModel
            .find({
                userID: userId,
                isRevoked: false,
                expiresAt: { $gt: new Date() },
            })
            .sort({ createdAt: -1 })
            .exec();
    }

    async refreshToken(refreshToken: string) {
        // Verify refresh token
        const decoded = await JwtHelper.verifyJWT(refreshToken);
        if (decoded instanceof Error) {
            throw new Error('Invalid refresh token');
        }

        // Check if refresh token exists in DB and is not revoked
        const storedToken = await this.findByToken(refreshToken);

        if (!storedToken || storedToken.isRevoked) {
            throw new Error('Refresh token not found or revoked');
        }

        // Check if token is expired
        if (storedToken.expiresAt < new Date()) {
            await this.revokeByToken(refreshToken);
            throw new Error('Refresh token expired');
        }

        // Enforce absolute max TTL since firstIssuedAt
        const maxTtlMs = this.parseMs(REFRESH_MAX_TTL);
        const firstIssuedAt = storedToken.firstIssuedAt ?? storedToken.createdAt;
        if (
            firstIssuedAt &&
            maxTtlMs &&
            Date.now() - new Date(firstIssuedAt).getTime() > maxTtlMs
        ) {
            await this.revokeByToken(refreshToken);
            throw new Error('Refresh token exceeded max lifetime');
        }

        // Generate new access token
        const newAccessToken = await JwtHelper.generateJWT({
            uid: storedToken.userID._id,
            name: storedToken.userID.name,
            email: storedToken.userID.email,
        });

        // Generate new refresh token
        const jti = randomUUID();
        const newRefreshTokenData = await JwtHelper.generateRefreshToken({
            uid: storedToken.userID._id,
            name: storedToken.userID.name,
            email: storedToken.userID.email,
            jti,
        });

        // Revoke old refresh token
        await this.revokeByToken(refreshToken);

        // Store new refresh token
        await this.create(
            storedToken.userID._id,
            newRefreshTokenData.token,
            newRefreshTokenData.expiresAt,
            undefined,
            undefined,
            firstIssuedAt,
            jti,
        );

        // Calculate expiration time in seconds
        const expiresIn = 15 * 60; // 15 minutes in seconds

        return {
            message: 'Refresh token',
            data: {
                accessToken: newAccessToken.token,
                refreshToken: newRefreshTokenData.token,
                expiresIn,
            },
        };
    }

    private parseMs(duration: string): number {
        const match = duration.match(/^(\d+)(s|m|h|d)$/);
        if (!match) return 0;
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
        return value * multipliers[unit];
    }
}
