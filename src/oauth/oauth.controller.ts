import { Controller, Get, Req, Res } from '@nestjs/common';
import { OAuthService } from '@src/oauth/oauth.service';
import { OAuthDto } from '@src/oauth/oauth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Data } from '@src/common/common.decorator';
import { CommonDoc } from '@src/common/common.doc';

@ApiTags('OAuth 2.0')
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
  ) {}

  @Get('')
  @CommonDoc({
    title: 'Базовый метод авторизации по протоколу OAuth 2.0',
    models: [OAuthDto],
    queries: [{
      name: 'oauthDto',
      required: true,
      description: 'Объект полей авторизации',
      type: '[OAuthDto]',
      example: [{ response_type: 'code', client_id: '...', redirect_uri: '...' }],
    }],
  })
  async oauth(
    @Data() oauthDto: OAuthDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const client = await this.oauthService.verify(oauthDto);
    const idCookie = req.cookies['id'];
    if (!idCookie) {
      const uri = '/auth_forms/auth.html';
      const queries = Object.entries(oauthDto)?.map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)?.join('&');
      return await res.redirect(`${uri}?${queries}`);
    }
    if (oauthDto.response_type === 'code') {
      // response_type=code
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      const url = await this.oauthService.code(client, idCookie, oauthDto.state);
      return await res.redirect(url);
    }
    if (oauthDto.response_type === 'token') {
      // response_type=token
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      const url = await this.oauthService.token(client, idCookie, oauthDto.state);
      return await res.redirect(url);
    }
  }
}
