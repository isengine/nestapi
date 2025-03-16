import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { tokenValidateSimple } from './hidden.guard.service';

@Injectable()
export class SimpleHiddenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    return tokenValidateSimple(token);
  }
}
