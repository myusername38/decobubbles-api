import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UserTokenData } from 'src/interfaces/users/user-token';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    console.log(context.switchToHttp().getRequest());
    let { user } = context.switchToHttp().getRequest();
    console.log(user);
    user = user as UserTokenData;

    let valid = true;
    requiredRoles.forEach((role) => {
      switch (role) {
        case Role.emailVerified:
          valid = valid && this.isVerified(user);
          break;
        case Role.owner:
          valid = valid && this.isOwner(user);
          break;
        case Role.admin:
          valid = valid && this.isAdmin(user);
          break;
        case Role.assistant:
          valid = valid && this.isAssistant(user);
          break;
        case Role.emailVerified:
          valid = valid && this.isVerified(user);
          break;
      }
    });

    return valid;
  }

  isOwner(user: UserTokenData): boolean {
    return user?.role === Role.owner ? true : false;
  }

  isAdmin(user: UserTokenData): boolean {
    return user?.role === Role.admin || this.isOwner(user);
  }

  isAssistant(user: UserTokenData): boolean {
    return user?.role === Role.assistant || this.isAdmin(user);
  }

  isRater(user: UserTokenData): boolean {
    return user?.role === Role.rater;
  }

  isVerified(user: UserTokenData): boolean {
    return user?.email_verified ? true : false;
  }
}
