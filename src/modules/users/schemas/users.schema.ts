import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
    @Prop()
    name: string;

    @Prop()
    lastname: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    country: string;

    @Prop({
        default: false,
    })
    isEmailVerified: boolean;

    @Prop({
        default: false,
    })
    isPhoneVerified: boolean;

    @Prop({
        default: false,
    })
    isSuspended: boolean;

    @Prop({
        default: false,
    })
    isDeleted: boolean;

    @Prop({
        default: null,
    })
    reasonSuspended: string;

    @Prop({})
    lastLogin: Date;

    @Prop({ default: null })
    origin: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    // Add deletedAt field
    @Prop({ default: null })
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
