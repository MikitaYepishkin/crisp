import { RoleTypeEnum } from '../enums';
import { CanActivate, ExecutionContext, Inject, mixin, Type } from '@nestjs/common';
import { RoleService } from 'src/modules/role';
import { isString } from 'lodash';

export const RoleGuard = (role: RoleTypeEnum): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(@Inject('RoleService') private readonly roleService: RoleService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const userRole = await this.roleService.getRoleByName(role);

      return user?.roles
        .map((role: any) => {
          return role && role._id ? role._id.toString() : role.toString();
        })
        .includes(String(userRole._id));
    }
  }

  return mixin(RoleGuardMixin);
};
