import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { validateRequest } from '../common/utils/validate-request.util';
import { ResponseUserDto } from '../user/dto/response-user.dto';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Req<{ user: ResponseUserDto }>>();

    if (!request.user) {
      throw new UnauthorizedException();
    }
    return validateRequest(request.user);
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    console.log(request);
    return true;
  }
}

type Req<T = any> = Request & T;
