import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/modules/users/schemas/users.schema';

export type AccessTokenDocument = AccessTokens & Document;

@Schema()
export class AccessTokens {
    @Prop({ required: true })
    token: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
        autopopulate: true,
        default: null,
    })
    userID: User;

    @Prop({ required: true })
    expiresIn: number;

    @Prop({ required: true, default: Date.now })
    createdAt: Date;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessTokens);
