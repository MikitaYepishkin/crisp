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
} from '@nestjs/common';
import { UserService } from './services';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { RoleGuard } from 'src/common/guards';
import { RoleTypeEnum } from 'src/common/enums';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'Returned all users.',
  })
  public async getUsers(): Promise<UserEntity[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'Returned a user by id.',
  })
  @ApiResponse({
    status: 404,
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
    status: 204,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found user.',
  })
  @ApiBody({ type: UpdateUserDto })
  public async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUserById(new Types.ObjectId(id), updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleTypeEnum.ADMIN))
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found user.',
  })
  public async deleteUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.deleteUserById(new Types.ObjectId(id));
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 201,
    description: 'User was successfully created.',
  })
  @ApiBody({ type: CreateUserDto })
  public async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
  }
}
