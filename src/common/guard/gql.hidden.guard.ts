import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { tokenValidate } from './hidden.guard.service';

@Injectable()
export class GqlHiddenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    const token = request.headers['authorization'];

    return tokenValidate(token);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
