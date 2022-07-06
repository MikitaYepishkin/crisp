import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatternDataEntity, PatternDataSchema } from './pattern-data.entity ';
import { PatternController } from './pattern.controller';
import { PatternEntity, PatternSchema } from './pattern.entity';
import { PatternDataService, PatternService } from './services';
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
    MongooseModule.forFeature([
      { name: PatternEntity.name, schema: PatternSchema },
      { name: PatternDataEntity.name, schema: PatternDataSchema },
    ]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [PatternService, PatternDataService],
  controllers: [PatternController],
  exports: [PatternService, PatternDataService],
})
export class PatternModule {}
