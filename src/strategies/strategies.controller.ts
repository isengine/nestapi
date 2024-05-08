import {
  Controller,
  Get,
  Header,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Id1tStrategiesGuard } from '@src/strategies/guard/id1t.guard';
import { GoogleStrategiesGuard } from '@src/strategies/guard/google.guard';
import { LeaderStrategiesGuard } from '@src/strategies/guard/leader.guard';
import { LeaderProvider } from '@src/strategies/provider/leader.provider';
import { SessionsService } from '@src/sessions/sessions.service';
import { TokenService } from '@src/token/token.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Стратегии авторизации')
@Controller('strategies')
export class StrategiesController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly tokenService: TokenService,
    private readonly leaderProvider: LeaderProvider,
  ) {}

  @Get('id1t/login')
  @UseGuards(Id1tStrategiesGuard)
  async id1tLogin() {
    return;
  }

  @Get('id1t/redirect')
  @Header('content-type', 'application/json')
  @UseGuards(Id1tStrategiesGuard)
  async id1tRedirect(@Req() req: any) {
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
