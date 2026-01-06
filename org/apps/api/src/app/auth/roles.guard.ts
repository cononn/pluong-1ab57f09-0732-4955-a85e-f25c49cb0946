import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@org/data';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // No roles required → allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // injected by AuthGuard / login

    if (!user || !user.role) {
      throw new ForbiddenException('No role assigned');
    }

    if (!requiredRoles.includes(user.role.name)) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    return true;
  }
}
