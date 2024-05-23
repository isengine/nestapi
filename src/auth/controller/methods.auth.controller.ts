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
import { AuthDto } from '@src/auth/auth.dto';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Data } from '@src/common/common.decorator';
import { CommonDoc } from '@src/common/common.doc';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';

@ApiTags('Авторизация')
@Controller('mauth')
export class MethodsAuthController {
  constructor(
    private readonly methodsAuthService: MethodsAuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('change/:code')
  async change(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
  ) {
    return this.methodsAuthService.change(authDto, code);
  }

  @Get('confirm/:code')
  async confirm(
    @Param('code') code: string,
  ) {
    return this.methodsAuthService.confirm(code);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.methodsAuthService.register(authDto);
  }

  @Post('reset')
  async reset(@Body() authDto: AuthDto) {
    return this.methodsAuthService.reset(authDto);
  }

  @Auth()
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: any) {
    return this.methodsAuthService.logout(req);
  }

  // new
  /*

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Get('confirm/:code')
  async confirm(
    @Param('code') code: string,
  ) {
    return this.authService.confirm(code);
  }

  @Post('reset')
  async reset(@Body() authDto: AuthDto) {
    return this.authService.reset(authDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('change/:code')
  async change(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
  ) {
    return this.authService.change(authDto, code);
  }

  @Auth()
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: any) {
    return this.authService.logout(req);
  }
  */
}
