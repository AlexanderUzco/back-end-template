import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';
import { paginate } from 'src/utils/paginate.utils';
import { WorkspaceDocument } from './schemas/workspace.schema';
import { Workspace } from './schemas/workspace.schema';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { FindWorkspaceQuery } from './dtos/find-workspace-query.dto';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectModel(Workspace.name, EDatabaseName.BASE)
        private readonly workspaceModel: Model<WorkspaceDocument>,
    ) {}

    async createWorkspace(
        createWorkspaceDto: CreateWorkspaceDto,
        user: AuthUserDto,
    ) {
        const workspace = await this.workspaceModel.create({
            ...createWorkspaceDto,
            ownerID: user._id,
        });
        return {
            message: 'Workspace created successfully',
            data: workspace,
        };
    }

    async findMany(params: FindWorkspaceQuery) {
        const { items, meta } = await paginate({
            model: this.workspaceModel,
            queryValues: params,
            populate: [{ path: 'ownerID', select: 'name email' }],
        });
        return {
            message: 'Workspace found',
            data: items,
            meta,
        };
    }
}
