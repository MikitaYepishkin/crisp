import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'src/config';
import { JwtConfigService } from '../auth/jwt-config.service';
import { PermissionService } from '../permission/services';
import { PermissionEntity, PermissionSchema } from './permission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PermissionEntity.name, schema: PermissionSchema }]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [PermissionService],
  controllers: [],
  exports: [PermissionService],
})
export class PermissionModule {}
