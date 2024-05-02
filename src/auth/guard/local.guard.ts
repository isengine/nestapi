// import { Injectable, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

// async canActivate(context: ExecutionContext): Promise<boolean> {
//   console.log('--- canActivate');
//   const a = localStorage.getItem('session');
//   console.log('--- a', a);
//   localStorage.setItem('session', '123456');
//   const b = localStorage.getItem('session');
//   console.log('--- b', b);
//   // console.log('-- context', context);
//   const request = context.switchToHttp().getRequest();
//   console.log('-- request', request);
//   const activate = (await super.canActivate(context)) as boolean;
//   // console.log('-- activate', activate);
//   await super.logIn(request);
//   return activate;
// }
