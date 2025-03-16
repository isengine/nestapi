import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { tokenValidateSimple } from './hidden.guard.service';

@Injectable()
export class GqlSimpleHiddenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    const token = request.headers['authorization'];

    return tokenValidateSimple(token);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
