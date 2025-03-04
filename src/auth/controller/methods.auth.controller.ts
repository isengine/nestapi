import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/auth/auth.decorator';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';

@ApiTags('Авторизация')
@Controller('auth/methods')
export class MethodsAuthController {
  constructor(private readonly methodsAuthService: MethodsAuthService) {}

  @Post('change/:code')
  async change(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.methodsAuthService.change(authDto, code, req, res);
  }

  @Get('confirm/:code')
  async confirm(
    @Param('code') code: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.methodsAuthService.confirm(code, req, res);
  }

  @Post('login')
  async login(
    @Body() grantsTokenDto: GrantsTokenDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.methodsAuthService.login(grantsTokenDto, req, res);
  }

  @Auth()
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    return await this.methodsAuthService.logout(req, res);
  }

  @Post('register')
  async register(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.methodsAuthService.register(authDto, subject, req, res);
  }

  @Post('reset')
  async reset(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.methodsAuthService.reset(authDto, subject, req, res);
  }

  @Post('hash/:string')
  async hash(@Param('string') string: string) {
    return await this.methodsAuthService.hash(string);
  }
}
