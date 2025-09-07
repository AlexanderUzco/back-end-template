import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/users.schema';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userID: User;

    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    isRevoked: boolean;

    @Prop()
    revokedAt?: Date;

    @Prop({ required: true })
    firstIssuedAt: Date;

    @Prop({ required: true, unique: true })
    jti: string;

    @Prop()
    userAgent?: string;

    @Prop()
    ipAddress?: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: null })
    deletedAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// Index for performance
RefreshTokenSchema.index({ userID: 1, isRevoked: 1 });
RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ jti: 1 });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
