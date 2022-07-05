import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectEntity, ProjectSchema } from './project.entity';
import { ProjectService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../role';
import { PermissionModule } from '../permission';
import { ConfigService } from 'src/config';
import { JwtConfigService } from '../auth/jwt-config.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    RoleModule,
    PermissionModule,
    MongooseModule.forFeature([{ name: ProjectEntity.name, schema: ProjectSchema }]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
