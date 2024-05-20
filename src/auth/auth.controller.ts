import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { OAuthDto } from '@src/auth/dto/oauth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Data } from '@src/common/common.decorator';
import { CommonDoc } from '@src/common/common.doc';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('')
  @CommonDoc({
    title: 'Базовый метод авторизации',
    models: [OAuthDto],
    queries: [{
      name: 'oauthDto',
      required: true,
      description: 'Объект полей авторизации',
      type: '[OAuthDto]',
      example: [{ response_type: 'code', client_id: '...', redirect_uri: '...' }],
    }],
  })
  async auth(
    @Data() oauthDto: OAuthDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const client = await this.authService.verify(oauthDto);
    const idCookie = req.cookies['id'];
    if (!idCookie) {
      const uri = '/forms/auth.html';
      const queries = Object.entries(oauthDto)?.map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)?.join('&');
      return await res.redirect(`${uri}?${queries}`);
    }
    if (oauthDto.response_type === 'code') {
      // response_type=code
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      const url = await this.authService.code(client, idCookie, oauthDto.state);
      return await res.redirect(url);
    }
    if (oauthDto.response_type === 'token') {
      // response_type=token
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      const url = await this.authService.token(client, idCookie, oauthDto.state);
      return await res.redirect(url);
    }
  }

  @Auth()
  @Get('self')
  @ApiExcludeEndpoint()
  async clientsSelf(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authService.findOne(id, [{ name: 'users' }, { name: 'strategies' }]);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
