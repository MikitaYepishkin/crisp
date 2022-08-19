import { Module } from '@nestjs/common';

import { DatabaseModule } from './database';
import { ConfigModule } from './config';

import { AuthModule } from './modules/auth';
import { UserModule } from './modules/user';
import { ProjectModule } from './modules/project';
import { PatternModule } from './modules/pattern';
import { FrameworkModule } from './modules/framework';
import { PageModule } from './modules/page';
import { ElementModule } from './modules/element';
import { SelectorModule } from './modules/selector';
import { ResourceModule } from './modules/resource';
import { RoleModule } from './modules/role';

// import { MailerModule, MailerService } from '@nestjs-modules/mailer';

@Module({
  imports: [
    /*
    MailerModule.forRoot({
      transport: 'smtps://crisp.mail.notification@gmail.com:crisp_2022@smtp.domain.com',
      defaults: {
        from: 'crisp.mail.notification@gmail.com',
      },
    }),
    */
    DatabaseModule,
    ConfigModule,
    AuthModule,
    UserModule,
    ProjectModule,
    PatternModule,
    FrameworkModule,
    PageModule,
    ElementModule,
    SelectorModule,
    ResourceModule,
    RoleModule,
  ],
  /*
  providers: [
    MailerService
  ],
  exports: [MailerService]
  */
})
export class AppModule {}
