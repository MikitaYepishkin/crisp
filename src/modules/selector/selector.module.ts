import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { PermissionModule } from '../permission';
import { RoleModule } from '../role';
import { SelectorService } from '../selector/services';
import { SelectorController } from './selector.controller';
import { SelectorEntity, SelectorSchema } from './selector.entity';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../auth/jwt-config.service';
import { ConfigService } from 'src/config';

@Module({
  imports: [
    RoleModule,
    PermissionModule,
    MongooseModule.forFeature([{ name: SelectorEntity.name, schema: SelectorSchema }]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [SelectorService],
  controllers: [SelectorController],
  exports: [SelectorService],
})
export class SelectorModule {}
