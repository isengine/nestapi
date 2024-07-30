import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OauthGuard } from '@src/auth_strategies/guard/oauth.guard';
import { GoogleGuard } from '@src/auth_strategies/guard/google.guard';
import { LeaderGuard } from '@src/auth_strategies/guard/leader.guard';
import { LeaderProvider } from '@src/auth_strategies/provider/leader.provider';
import { AuthSessionsService } from '@src/auth_sessions/auth_sessions.service';
import { TokenService } from '@src/token/token.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthStrategiesService } from '@src/auth_strategies/auth_strategies.service';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { OauthProvider } from '@src/auth_strategies/provider/oauth.provider';

@ApiTags('Стратегии авторизации')
@Controller('auth/strategies')
export class AuthStrategiesController {
  constructor(
    private readonly authStrategiesService: AuthStrategiesService,
    private readonly authSessionsService: AuthSessionsService,
    private readonly tokenService: TokenService,
    private readonly leaderProvider: LeaderProvider,
    private readonly oauthProvider: OauthProvider,
  ) {}

  @Auth()
  @Get('self')
  // @ApiExcludeEndpoint()
  async self(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authStrategiesService.findAll(undefined, id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Auth()
  @Get('self/:name')
  // @ApiExcludeEndpoint()
  async selfByName(
    @Self() auth: AuthDto,
    @Param('name') name: string,
  ) {
    const { id } = auth;
    const where = { name };
    const result = await this.authStrategiesService.find(where, undefined, undefined, id);
    if (!result) {
      throw new NotFoundException('Entry not found');
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
  async oauthRedirect(@Req() req: any) {
    const account = await this.oauthProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.oauthProvider.validate(account);
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
  async googleRedirect(@Req() req: any) {
    const { user: auth } = req;
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
  async leaderRedirect(@Req() req: any) {
    const account = await this.leaderProvider.activate(req);
    if (!account) {
      return account;
    }
    const auth = await this.leaderProvider.validate(account);
    const token = await this.tokenService.pair({ id: auth.id });
    await this.authSessionsService.start(auth, req);
    // auth.token = token;
    delete auth.password;
    return { auth, token };
  }
}
