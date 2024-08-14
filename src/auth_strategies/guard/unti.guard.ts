import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UntiGuard extends AuthGuard('unti') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const activate = (await super.canActivate(context)) as boolean;
    await super.logIn(request);
    return activate;
  }
}
