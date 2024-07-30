import { Controller, Get, Req, Res } from '@nestjs/common';
import { OpenAuthService } from '@src/auth/service/open.auth.service';
import { OpenAuthDto } from '@src/auth/dto/open.auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Data } from '@src/common/common.decorator';
import { CommonDoc } from '@src/common/common.doc';
import { Cookie } from '@src/common/service/cookie.service';

@ApiTags('OAuth 2.0')
@Controller('auth')
export class OpenAuthController {
  constructor(
    private readonly openAuthService: OpenAuthService,
  ) {}

  @Get('')
  @CommonDoc({
    title: 'Базовый метод авторизации по протоколу OAuth 2.0',
    models: [OpenAuthDto],
    queries: [{
      name: 'openAuthDto',
      required: true,
      description: 'Объект полей авторизации',
      type: '[OpenAuthDto]',
      example: [{ response_type: 'code', client_id: '...', redirect_uri: '...' }],
    }],
  })
  async openAuth(
    @Data() openAuthDto: OpenAuthDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const client = await this.openAuthService.verify(openAuthDto);
    const cookie = new Cookie(req, res);
    const idCookie = cookie.get('id');
    if (!idCookie) {
      const uri = '/auth/auth.html';
      const queries = Object.entries(openAuthDto)?.map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)?.join('&');
      return await res.redirect(`${uri}?${queries}`);
    }
    if (openAuthDto.response_type === 'code') {
      // response_type=code
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      const url = await this.openAuthService.code(client, idCookie, openAuthDto.state);
      return await res.redirect(url);
    }
    if (openAuthDto.response_type === 'token') {
      // response_type=token
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      const url = await this.openAuthService.token(client, idCookie, openAuthDto.state);
      return await res.redirect(url);
    }
  }
}
