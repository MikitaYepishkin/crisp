import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'src/config';
import { JwtConfigService } from '../auth/jwt-config.service';
import { ResourceService } from '../resource/services';
import { RoleModule } from '../role';
import { ResourceController } from './resource.controller';
import { ResourceEntity, ResourceSchema } from './resource.entity';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: ResourceEntity.name, schema: ResourceSchema }]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ResourceService],
  controllers: [ResourceController],
  exports: [ResourceService],
})
export class ResourceModule {}
