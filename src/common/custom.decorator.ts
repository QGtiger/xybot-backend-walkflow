import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';

export enum DECORATORKEYENUM {
  REQUIRE_LOGIN = 'requireLogin',
  REQUIRE_PERMISSION = 'requirePermission',
}

export const RequireLogin = () =>
  SetMetadata(DECORATORKEYENUM.REQUIRE_LOGIN, true);

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(DECORATORKEYENUM.REQUIRE_PERMISSION, permissions);

export const UserInfo = createParamDecorator(
  (key: keyof Request['user'], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) return null;

    return key ? request.user[key] : request.user;
  },
);
