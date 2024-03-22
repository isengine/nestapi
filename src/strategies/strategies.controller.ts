import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from '@src/auth/guard/google.guard';
import { LeaderAuthGuard } from '@src/auth/guard/leader.guard';
import { LeaderProvider } from '@src/strategies/provider/leader.provider';
import { SessionsService } from '@src/sessions/sessions.service';
import { TokensService } from '@src/tokens/tokens.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Стратегии авторизации')
@Controller('strategies')
export class StrategiesController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly tokensService: TokensService,
    private readonly leaderProvider: LeaderProvider,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: any) {
    const { user: auth } = req;
    const tokens = await this.tokensService.tokensCreatePair(auth);
    await this.sessionsService.createSession(auth, tokens, req);
    auth.tokens = tokens;
    return auth;
  }

  @Get('leader/login')
  @UseGuards(LeaderAuthGuard)
  async leaderLogin() {
    return;
  }

  @Get('leader/redirect')
  // @UseGuards(LeaderAuthGuard)
  async leaderRedirect(@Req() req: any) {
    const account = await this.leaderProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.leaderProvider.validate(account);
    const tokens = await this.tokensService.tokensCreatePair(auth);
    await this.sessionsService.createSession(auth, tokens, req);
    // auth.tokens = tokens;
    return { ...auth, tokens };
  }
}
