import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Session,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { Auth } from '@src/auth/auth.decorator';
import { GoogleAuthGuard } from '@src/auth/guard/google.guard';
import { LeaderAuthGuard } from '@src/auth/guard/leader.guard';
import { LeaderProvider } from '@src/auth/provider/leader.provider';
import { SessionsService } from '@src/sessions/sessions.service';
import { TokensService } from '@src/tokens/tokens.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
    private readonly tokensService: TokensService,
    private readonly leaderProvider: LeaderProvider,
  ) {}

  @Get('get_all')
  @Auth()
  async authGetAll() {
    return await this.authService.authGetAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() authDto: AuthDto, @Req() req: any) {
    return this.authService.login(authDto, req);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() authDto: AuthDto, @Req() req: any) {
    return this.authService.register(authDto, req);
  }

  @Auth()
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: any) {
    return this.authService.logout(req);
  }

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
    return {
      ...auth,
      ...tokens,
    };
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
    return {
      ...auth,
      ...tokens,
    };
  }

  @Get('status')
  @Auth()
  async authStatus(@Req() request: any) {
    return { msg: request?.user ? 'Authenticated' : 'Not Authenticated' };
  }

  // logout
  // аутентификация на основе токенов не имеет состояния и сервер ее не отслеживает
  // запрос к серверу без токена рассматривается как от незарегистрированного пользователя
  // поэтому logout производится на стороне клиента путем удаления jwt-токена из запросов

  @Get('logout')
  @Auth()
  async authLogout(@Session() session: any) {
    console.log('session', session);
  }
}
