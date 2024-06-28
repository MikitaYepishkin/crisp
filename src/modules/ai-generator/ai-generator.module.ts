import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'src/config';
import { JwtConfigService } from '../auth/jwt-config.service';
import { AIGeneratorService } from './services';
import { AIGeneratorController } from './ai-generator.controller';

@Module({
  imports: [
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AIGeneratorService],
  controllers: [AIGeneratorController],
  exports: [AIGeneratorService],
})
export class AIGeneratorModule {}
