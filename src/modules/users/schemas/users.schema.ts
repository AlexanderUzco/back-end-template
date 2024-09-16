import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ERole } from 'src/common/constants/role.constants';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
    _id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    lastName: string;

    @Prop()
    password: string;

    @Prop({ unique: true })
    email: string;

    @Prop({ default: ERole.USER })
    role: ERole;

    @Prop({ default: false })
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

    @Prop({
        default: null,
    })
    lastLogin: Date;

    @Prop({ default: null })
    origin: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: null })
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
