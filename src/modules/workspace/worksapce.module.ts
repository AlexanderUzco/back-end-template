import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { EDatabaseName } from 'src/common/constants/database.constants';

import { Workspace, WorkspaceSchema } from './schemas/workspace.schema';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync(
            [
                {
                    name: Workspace.name,
                    useFactory: () => {
                        const schema = WorkspaceSchema;
                        return schema;
                    },
                    inject: [getConnectionToken(EDatabaseName.BASE)],
                },
            ],
            EDatabaseName.BASE,
        ),
    ],
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
    exports: [WorkspaceService],
})
export class WorkspaceModule {}
