import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { PatternModule } from '../pattern';
import { SelectorModule } from '../selector';
import { ElementController } from './element.controller';
import { ElementEntity, ElementSchema } from './element.entity';
import { ElementService } from './services';
import { ConfigService } from 'src/config';
import { JwtConfigService } from '../auth/jwt-config.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    SelectorModule,
    PatternModule,
    MongooseModule.forFeature([{ name: ElementEntity.name, schema: ElementSchema }]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ElementService],
  controllers: [ElementController],
  exports: [ElementService],
})
export class ElementModule {}
