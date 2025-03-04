import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

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
    response.redirect(`/auth/auth.html?data=${data}`);
  }
}
