import {
  Controller,
  Get,
  Header,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OauthStrategiesGuard } from '@src/strategies/guard/oauth.guard';
import { GoogleStrategiesGuard } from '@src/strategies/guard/google.guard';
import { LeaderStrategiesGuard } from '@src/strategies/guard/leader.guard';
import { LeaderProvider } from '@src/strategies/provider/leader.provider';
import { SessionsService } from '@src/sessions/sessions.service';
import { TokenService } from '@src/token/token.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Стратегии авторизации')
@Controller('strategies')
export class StrategiesController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly tokenService: TokenService,
    private readonly leaderProvider: LeaderProvider,
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
    const tokens = await this.tokenService.tokenCreatePair({ id: auth.id });
    await this.sessionsService.createSession(auth, tokens, req);
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
    const token = await this.tokenService.tokenCreatePair({ id: auth.id });
    await this.sessionsService.createSession(auth, token, req);
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
    const account = await this.leaderProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.leaderProvider.validate(account);
    const token = await this.tokenService.tokenCreatePair({ id: auth.id });
    await this.sessionsService.createSession(auth, token, req);
    // auth.token = token;
    return { ...auth, token };
  }
}
