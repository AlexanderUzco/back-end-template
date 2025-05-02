import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class FindWorkspaceQuery {
    @IsOptional()
    @Transform(({ value }: { value: string }) => new Types.ObjectId(value))
    readonly _id?: Types.ObjectId;

    @IsOptional()
    @Transform(({ value }: { value: string }) => new Types.ObjectId(value))
    readonly ownerID?: Types.ObjectId;

    @IsString()
    @IsOptional()
    readonly name?: string;
}
