import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { HandleException } from 'src/common/decorators/handle-exceptio-decorator.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';

import { AuthUser } from '../auth/auth.decorator';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { FindWorkspaceQuery } from './dtos/find-workspace-query.dto';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @Post()
    @HandleException('ERROR CREATE WORKSPACE')
    async createWorkspace(
        @Body() createWorkspaceDto: CreateWorkspaceDto,
        @AuthUser() user: AuthUserDto,
    ) {
        return this.workspaceService.createWorkspace(createWorkspaceDto, user);
    }

    @Get()
    @UseGuards(AdminGuard)
    @HandleException('ERROR FIND MANY WORKSPACE')
    async findMany(
        @Query(new ValidationPipe({ transform: true }))
        findWorkspaceQuery: FindWorkspaceQuery,
    ) {
        return this.workspaceService.findMany(findWorkspaceQuery);
    }
}
