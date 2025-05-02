import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { FindWorkspaceQuery } from './dtos/find-workspace-query.dto';
import { HandleException } from 'src/common/decorators/handle-exceptio-decorator.decorator';
import { AuthUser } from '../auth/auth.decorator';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

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
