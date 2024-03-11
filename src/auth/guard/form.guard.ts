// import { Injectable, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FormAuthGuard extends AuthGuard('form') {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     try {
//       const result = await super.canActivate(context);
//       console.log(' --- result ', result);
//       const request = context.switchToHttp().getRequest();
//       // console.log(' --- request ', request);
//       return true;
//     } catch (error) {
//       console.log('auth error - ', error.message);
//     }
//   }
// }
