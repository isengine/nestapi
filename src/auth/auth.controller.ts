import {
  Body,
  Controller,
  Get,
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
import { AuthOauthDto } from '@src/auth/dto/auth.oauth.dto';
import { AuthOauthService } from '@src/auth/service/auth.oauth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authOauthService: AuthOauthService,
  ) {}

  // @Auth()
  @Client()
  @Get('oauth')
  @ApiOperation({ summary: 'Базовый метод авторизации' })
  @ApiQuery({
    name: 'authOauthDto',
    required: true,
    description: 'Объект полей авторизации',
    type: '[AuthOauthDto], обязательный',
    example: JSON.stringify([{ response_type: 'code', client_id: '...', redirect_uri: '...' }]),
  })
  @ApiExtraModels(AuthOauthDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(AuthOauthDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async oauth(
    @Body() authOauthDto: AuthOauthDto,
    // @Self() id: number,
    @SelfClient() id: number,
    @Res() res: any,
  ) {
    let url = '';
    const result = await this.authOauthService.oauthPrepare(authOauthDto, id);
    if (authOauthDto.response_type === 'code') {
      // response_type=code
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      url = await this.authOauthService.oauthCode(result, authOauthDto.state);
    }
    if (authOauthDto.response_type === 'token') {
      // response_type=token
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      url = await this.authOauthService.oauthToken(result, authOauthDto.state);
    }
    return await res.redirect(url);
  }

  @Auth()
  @Client()
  @Post('secure')
  @ApiExcludeEndpoint()
  async authSecure(@Self() id: number) {
    const result = await this.authService.findOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Auth()
  @Get('get_all')
  @ApiExcludeEndpoint()
  async authGetAll() {
    return await this.authService.findAll();
  }

  @Auth()
  @Get('self')
  @ApiExcludeEndpoint()
  async clientsSelf(@Self() id: number) {
    const result = await this.authService.findOne(id);
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
