import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { DECORATORKEYENUM } from './custom.decorator';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const requireLoginFlag = this.reflector.getAllAndOverride(
      DECORATORKEYENUM.REQUIRE_LOGIN,
      [context.getClass(), context.getHandler()],
    );

    if (!requireLoginFlag) return true;

    const { walkflowuserid } = request.headers;
    if (!walkflowuserid) {
      throw new UnauthorizedException('请先登录');
    }

    request.user = {
      id: walkflowuserid,
    };

    return true;
  }
}
