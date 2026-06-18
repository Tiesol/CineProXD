import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'src/user/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { JwtUser } from '../strategies/jwt.strategy';

interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return !!user && required.includes(user.role);
  }
}
