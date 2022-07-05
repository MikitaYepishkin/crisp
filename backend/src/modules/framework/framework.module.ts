import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { FrameworkController } from './framework.controller';
import { FrameworkEntity, FrameworkSchema } from './framework.entity';
import { FrameworkService } from './services';
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
    MongooseModule.forFeature([{ name: FrameworkEntity.name, schema: FrameworkSchema }]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [FrameworkService],
  controllers: [FrameworkController],
  exports: [FrameworkService],
})
export class FrameworkModule {}
