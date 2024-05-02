import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Client, SelfClient } from '@src/clients/clients.decorator';
import { ApiOperation, ApiExtraModels, ApiBody, ApiParam, ApiQuery, ApiResponse, getSchemaPath, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { OAuthDto } from '@src/auth/dto/oauth.dto';
import { OAuthService } from '@src/auth/service/oauth.service';
import { Data } from '@src/app.decorator';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Базовый метод авторизации' })
  @ApiQuery({
    name: 'oauthDto',
    required: true,
    description: 'Объект полей авторизации',
    type: '[OAuthDto], обязательный',
    example: JSON.stringify([{ response_type: 'code', client_id: '...', redirect_uri: '...' }]),
  })
  @ApiExtraModels(OAuthDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(OAuthDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async auth(
    @Data() oauthDto: OAuthDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    console.log('-- Базовый метод авторизации...');
    console.log('-- oauthDto', oauthDto);

    const client = await this.oauthService.oauthVerify(oauthDto);

    const idCookie = req.cookies['id'];
    console.log('-- idCookie', idCookie);

    if (!idCookie) {
      const uri = '/form/login.html';
      const queries = Object.entries(oauthDto)?.map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)?.join('&');
      return await res.redirect(`${uri}?${queries}`);
    }

    let url = '';

    if (oauthDto.response_type === 'code') {
      // response_type=code
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      url = await this.oauthService.oauthCode(client, idCookie, oauthDto.state);
    }
    if (oauthDto.response_type === 'token') {
      // response_type=token
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      url = await this.oauthService.oauthToken(client, idCookie, oauthDto.state);
    }
    console.log('-- url', url);
    console.log('-- res.redirect...');
    return await res.redirect(url);
  }

  @Auth()
  @Get('self')
  @ApiExcludeEndpoint()
  async clientsSelf(@Self() id: number) {
    const result = await this.authService.findOne(id, [{ name: 'user' }]);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  @ApiOperation({ summary: 'Базовый метод регистрации' })
  @ApiQuery({
    name: 'authDto',
    required: true,
    description: 'Объект полей регистрации',
    type: '[AuthDto], обязательный',
    example: JSON.stringify([{ username: '...', password: '...' }]),
  })
  @ApiExtraModels(AuthDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(AuthDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async register(@Body() authDto: AuthDto, @Req() req: any) {
    return this.authService.register(authDto, req);
  }

  @Get('confirm/:code')
  @ApiOperation({ summary: 'Метод подтверждения регистрации и активации учетной записи' })
  @ApiParam({
    name: 'code',
    required: true,
    description: 'Код подтверждения',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async confirm(
    @Param('code') code: string,
  ) {
    return this.authService.confirm(code);
  }

  @Post('restore')
  @ApiOperation({ summary: 'Запрос на смену пароля пользователя' })
  @ApiQuery({
    name: 'authDto',
    required: true,
    description: 'Объект полей регистрации',
    type: '[AuthDto], обязательный',
    example: JSON.stringify([{ username: '...' }]),
  })
  @ApiExtraModels(AuthDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(AuthDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async restorePrepare(@Body() authDto: AuthDto) {
    return this.authService.restorePrepare(authDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('restore/:code')
  @ApiOperation({ summary: 'Метод смены пароля пользователя' })
  @ApiParam({
    name: 'code',
    required: true,
    description: 'Код подтверждения',
  })
  @ApiQuery({
    name: 'authDto',
    required: true,
    description: 'Объект полей регистрации',
    type: '[AuthDto], обязательный',
    example: JSON.stringify([{ password: '...' }]),
  })
  @ApiExtraModels(AuthDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(AuthDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async restore(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
  ) {
    return this.authService.restore(authDto, code);
  }

  @Auth()
  @HttpCode(200)
  @Post('logout')
  @ApiOperation({ summary: 'Базовый метод выхода' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async logout(@Req() req: any) {
    return this.authService.logout(req);
  }
}
