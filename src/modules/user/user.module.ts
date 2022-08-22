import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services';
import { UserEntity, UserSchema } from './user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../auth/jwt-config.service';
import { ConfigService } from 'src/config';
import { RoleModule } from '../role/role.module';
import { BcryptHashService } from '../../common/services';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    RoleModule,
    MailerModule.forRoot({
      transport: 'smtps://crisp.mail.notification@gmail.com:crisp_2022@smtp.domain.com',
      defaults: {
        from: 'crisp.mail.notification@gmail.com',
      },
    }),
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    JwtModule.registerAsync({ useClass: JwtConfigService, inject: [ConfigService] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UserService, BcryptHashService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
