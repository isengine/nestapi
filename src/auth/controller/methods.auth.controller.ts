import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/auth/auth.decorator';
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

  @Auth()
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: any) {
    return this.methodsAuthService.logout(req);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
    @Req() request: any,
  ) {
    return this.methodsAuthService.register(authDto, subject, request);
  }

  @Post('reset')
  async reset(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
  ) {
    return this.methodsAuthService.reset(authDto, subject);
  }
}
