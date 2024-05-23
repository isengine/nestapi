import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OauthGuard extends AuthGuard('oauth') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const activate = (await super.canActivate(context)) as boolean;
    await super.logIn(request);
    return activate;
  }
}
