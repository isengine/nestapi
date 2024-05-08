import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException, ForbiddenException)
export class Unauthorized implements ExceptionFilter {
  async catch(
    _exception: ForbiddenException | UnauthorizedException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { body, headers, method, protocol, url } = response.req;
    const dataParsed = {
      body,
      method,
      url: `${protocol}://${headers.host}${url}`,
    };
    const data = Buffer.from(JSON.stringify(dataParsed)).toString('base64');
    // response.req.cookies['abc'] = '123qweqwe';
    // response.req.session['abc'] = '123qweqwe';
    console.log('---- request.data', dataParsed);
    // console.log('-- request.session', response.req.session);
    console.log('-- request.cookies', response.req.cookies);

    response.redirect(`/forms/login.html?data=${data}`);
  }
}