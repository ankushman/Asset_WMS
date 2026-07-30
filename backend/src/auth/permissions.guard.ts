import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      // In dev fallback mode if user header present
      return true;
    }

    const userPermissions: string[] = user.permissions || [];

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm) || userPermissions.includes('SUPER_ADMIN_ALL')
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `RBAC Policy Violation: Missing required permission [${requiredPermissions.join(
          ', '
        )}] for company isolated workspace.`
      );
    }

    return true;
  }
}
