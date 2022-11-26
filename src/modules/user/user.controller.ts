import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  ValidationPipe,
  Post,
  HttpStatus,
  HostParam,
  Req
} from '@nestjs/common';
import { UserService } from './services';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { RoleGuard } from 'src/common/guards';
import { RoleTypeEnum } from 'src/common/enums';
import { MailerService } from '@nestjs-modules/mailer';
import { hostname } from 'os';
import { ArgumentsHost, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';


@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  private mailTemplate(data) {
    return `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div style="box-shadow: 1px 3px 5px 3px rgb(0, 0, 0, 0.5);background-color: rgba(0, 0, 0, 0.1);width: 800px;">
        <div style="border-bottom: 1px solid rgba(0,0,0,0.4);box-shadow: 0px 2px 3px 0px rgb(0, 0, 0, 0.40);background-color: rgba(0, 0, 0, 0.2);padding: 10px;">
            <h1 style="margin-left: 5px;">
                Crisp automatic mailing
            </h1>
        </div>
        <div style="padding: 10px 0;">
            <h3 style="width: 95%;text-align: center;">
                Hello ${data.user}! Congratulations, you have been added to project ${data.project} as ${data.role}.
                Below you can see your credentials.
            </h3>
            <div style="background-color: rgba(0,0,0,0.1);border: 1px solid rgba(0,0,0,0.1);width: 80%;">
                <div style="text-align: center;width: 100%;border-bottom: 1px solid rgba(0,0,0,0.1);"><b>Credentials</b></div>
                <div style="width: 100%;">
                    <div style="width: 100%;border-bottom: 1px solid rgba(0,0,0,0.1);">
                        <div style="display: inline-block;border-right: 1px solid rgba(0,0,0,0.1);text-align: center;">Email</div>
                        <div style="display: inline-block;">${data.email}</div>
                    </div>
                    <div style="width: 100%;border-bottom: 1px solid rgba(0,0,0,0.1);">
                        <div style="display: inline-block;border-right: 1px solid rgba(0,0,0,0.1);text-align: center;">Password</div>
                        <div style="display: inline-block;">${data.password}</div>
                    </div>
                    <div style="width: 100%;">
                        <div style="display: inline-block;border-right: 1px solid rgba(0,0,0,0.1);text-align: center;">Host</div>
                        <div style="display: inline-block;">${data.host}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  private async sendMailForUser(user: any): Promise<void> {
    const resp = await this.mailerService.sendMail({
      to: user.email, 
      from: 'crisp.mail.notification@gmail.com',
      subject: 'Message from Crisp', 
      text: 'This message was sent from Node js server.', 
      html: this.mailTemplate({
        email: user.email,
        user: user.username,
        project: user.project || '',
        role: user.role || 'User',
        password: user.password,
        host: user.host || ''
      })//'This <i>message</i> was sent from <strong>Node js</strong> server.', 
    });
  
    if (resp) {
      console.log('---- send mail successful -----');
    } else {
      console.log('---- send mail error -----');
    }
  
    console.log('---- send mail ended -----');
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returned all users.',
  })
  public async getUsers(): Promise<UserEntity[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returned a user by id.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found user.',
  })
  public async getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getUserById(new Types.ObjectId(id));
  }

  @Put(':id')
  @UseGuards(RoleGuard(RoleTypeEnum.ADMIN))
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found user.',
  })
  @ApiBody({ type: UpdateUserDto })
  public async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    console.log('------------------- [0] --------------------------');
    const data = updateUserDto.projects? {
      ...updateUserDto,
      projects: updateUserDto.projects.map(proj => new Types.ObjectId(proj))
    } : updateUserDto;
    return this.userService.updateUserById(new Types.ObjectId(id), data);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleTypeEnum.ADMIN))
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found user.',
  })
  public async deleteUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.deleteUserById(new Types.ObjectId(id));
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User was successfully created.',
  })
  @ApiBody({ type: CreateUserDto })
  public async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Req() req: Request
  ): Promise<UserEntity> {
    const data = createUserDto.roles? {
      ...createUserDto,
      roles: createUserDto.roles.map(role => new Types.ObjectId(role))
    } : createUserDto;
    const user = this.userService.createUser(data);

    await this.sendMailForUser({
      ...createUserDto,
      host: req.hostname
    });

    return user;
  }
}
