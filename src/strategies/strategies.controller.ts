import {
  Controller,
  Get,
  Header,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OauthStrategiesGuard } from '@src/strategies/guard/oauth.strategies.guard';
import { GoogleStrategiesGuard } from '@src/strategies/guard/google.strategies.guard';
import { LeaderStrategiesGuard } from '@src/strategies/guard/leader.strategies.guard';
import { LeaderStrategiesProvider } from '@src/strategies/provider/leader.strategies.provider';
import { AuthSessionsService } from '@src/auth_sessions/auth_sessions.service';
import { TokenService } from '@src/token/token.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Стратегии авторизации')
@Controller('strategies')
export class StrategiesController {
  constructor(
    private readonly authSessionsService: AuthSessionsService,
    private readonly tokenService: TokenService,
    private readonly leaderStrategiesProvider: LeaderStrategiesProvider,
  ) {}

  @Get('oauth/login')
  @UseGuards(OauthStrategiesGuard)
  async oauthLogin() {
    return;
  }

  @Get('oauth/redirect')
  @Header('content-type', 'application/json')
  @UseGuards(OauthStrategiesGuard)
  async oauthRedirect(@Req() req: any) {
    const { user: auth } = req;
    const tokens = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, tokens, req);
    return {
      ...auth,
      ...tokens,
    };
  }

  @Get('google/login')
  @UseGuards(GoogleStrategiesGuard)
  async googleLogin() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleStrategiesGuard)
  async googleRedirect(@Req() req: any) {
    const { user: auth } = req;
    const token = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, token, req);
    auth.token = token;
    return auth;
  }

  @Get('leader/login')
  @UseGuards(LeaderStrategiesGuard)
  async leaderLogin() {
    return;
  }

  @Get('leader/redirect')
  // @UseGuards(LeaderStrategiesGuard)
  async leaderRedirect(@Req() req: any) {
    const account = await this.leaderStrategiesProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.leaderStrategiesProvider.validate(account);
    const token = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, token, req);
    // auth.token = token;
    return { ...auth, token };
  }
}
