import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookie } from '@src/common/service/cookie.service';
import { TokenService } from '@src/token/token.service';

import { AuthStrategiesService } from './auth_strategies.service';
import { OauthGuard } from './guard/oauth.guard';
import { GoogleGuard } from './guard/google.guard';
import { LeaderGuard } from './guard/leader.guard';
import { UntiGuard } from './guard/unti.guard';
import { LeaderProvider } from './provider/leader.provider';
import { OauthProvider } from './provider/oauth.provider';
import { UntiProvider } from './provider/unti.provider';

import { AuthSessionsService } from '../auth_sessions/auth_sessions.service';
import { AuthDto } from '../auth.dto';
import { Auth, Self } from '../auth.decorator';
import { OpenAuthService } from '../service/open.auth.service';

@ApiTags('Стратегии авторизации')
@Controller('auth/strategies')
export class AuthStrategiesController {
  constructor(
    private readonly authStrategiesService: AuthStrategiesService,
    private readonly authSessionsService: AuthSessionsService,
    private readonly tokenService: TokenService,
    private readonly leaderProvider: LeaderProvider,
    private readonly untiProvider: UntiProvider,
    private readonly oauthProvider: OauthProvider,
    private readonly openAuthService: OpenAuthService,
  ) {}

  @Auth()
  @Get('self')
  // @ApiExcludeEndpoint()
  async self(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authStrategiesService.find({}, { id });
    if (!result) {
      throw new NotFoundException('Entrie not found');
    }
    return result;
  }

  @Auth()
  @Get('self/:name')
  // @ApiExcludeEndpoint()
  async selfByName(@Self() auth: AuthDto, @Param('name') name: string) {
    const { id } = auth;
    const where = { name };
    const result = await this.authStrategiesService.find({ where }, { id });
    if (!result) {
      throw new NotFoundException('Entrie not found');
    }
    return result;
  }

  @Get('oauth/login')
  @UseGuards(OauthGuard)
  async oauthLogin() {
    return;
  }

  @Get('oauth/redirect')
  @Header('content-type', 'application/json')
  // @UseGuards(OauthGuard)
  async oauthRedirect(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const account = await this.oauthProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.oauthProvider.validate(account);

    const cookie = new Cookie(req, res);
    const openAuthDto = cookie.getJson('query');

    if (openAuthDto?.response_type === 'code') {
      const client = await this.openAuthService.verify(openAuthDto);
      const url = await this.openAuthService.code(
        client,
        auth.id,
        openAuthDto.state,
      );
      return await res.redirect(url);
    }

    const token = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, req);
    delete auth.password;
    return { auth, token };
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  async googleLogin() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async googleRedirect(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const { user: auth } = req;

    const cookie = new Cookie(req, res);
    const openAuthDto = cookie.getJson('query');

    if (openAuthDto?.response_type === 'code') {
      const client = await this.openAuthService.verify(openAuthDto);
      const url = await this.openAuthService.code(
        client,
        auth.id,
        openAuthDto.state,
      );
      return await res.redirect(url);
    }

    const token = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, req);
    delete auth.password;
    return { auth, token };
  }

  @Get('leader/login')
  @UseGuards(LeaderGuard)
  async leaderLogin() {
    return;
  }

  @Get('leader/redirect')
  // @UseGuards(LeaderGuard)
  async leaderRedirect(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const account = await this.leaderProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.leaderProvider.validate(account);

    const cookie = new Cookie(req, res);
    const openAuthDto = cookie.getJson('query');

    if (openAuthDto?.response_type === 'code') {
      const client = await this.openAuthService.verify(openAuthDto);
      const url = await this.openAuthService.code(
        client,
        auth.id,
        openAuthDto.state,
      );
      return await res.redirect(url);
    }

    const token = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, req);
    // auth.token = token;
    delete auth.password;
    return { auth, token };
  }

  @Get('2035/login')
  @UseGuards(UntiGuard)
  async untiLogin() {
    return;
  }

  @Get('2035/redirect')
  // @UseGuards(UntiGuard)
  async untiRedirect(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const account = await this.untiProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.untiProvider.validate(account);

    const cookie = new Cookie(req, res);
    const openAuthDto = cookie.getJson('query');

    if (openAuthDto?.response_type === 'code') {
      const client = await this.openAuthService.verify(openAuthDto);
      const url = await this.openAuthService.code(
        client,
        auth.id,
        openAuthDto.state,
      );
      return await res.redirect(url);
    }

    const token = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, req);
    // auth.token = token;
    delete auth.password;
    return { auth, token };
  }
}
