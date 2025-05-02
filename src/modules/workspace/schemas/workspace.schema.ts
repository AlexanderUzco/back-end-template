import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/users.schema';

export type WorkspaceDocument = Workspace & Document;

@Schema()
export class Workspace extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, ref: User.name })
    ownerID: Types.ObjectId;

    @Prop({ default: null })
    description: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: null })
    deletedAt: Date;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
