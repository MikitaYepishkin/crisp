import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { RoleService } from './services';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { RoleEntityWithId } from './role.entity';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returned all roles.',
  })
  public async getRoles(): Promise<RoleEntityWithId[]> {
    return this.roleService.getRoles();
  }
}
