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
import { FormsAuthService } from '@src/auth/service/forms.auth.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';

@ApiTags('Авторизация через формы')
@Controller('auth')
export class FormsAuthController {
  constructor(
    private readonly formsAuthService: FormsAuthService,
  ) {}

  @Post('change/:code')
  @CommonDoc({
    title: 'Смена пароля пользователя',
    models: [],
    params: [{
      name: 'code',
      required: true,
      description: 'Код подтверждения',
    }],
      queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей регистрации',
      type: '[AuthDto]',
      example: [{ password: '...' }],
    }],
  })
  async change(
    @Body() authDto: AuthDto,
    @Param('code') code: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.change(authDto, code, req, res);
  }

  @Get('confirm/:code')
  @CommonDoc({
    title: 'Подтверждение регистрации и активация учетной записи',
    models: [],
    params: [{
      name: 'code',
      required: true,
      description: 'Код подтверждения',
    }],
  })
  async confirm(
    @Param('code') code: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.confirm(code, req, res);
  }  

  @Post('login')
  @CommonDoc({
    title: 'Авторизация',
    models: [],
    queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей авторизации',
      type: '[AuthDto]',
      example: { username: '...', password: '...' },
    }],
  })
  async login(
    @Body() grantsTokenDto: GrantsTokenDto,
    @Body('response_type') response_type: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.login(grantsTokenDto, response_type, req, res);
  }

  //@Auth()
  @Post('logout')
  @CommonDoc({
    title: 'Выход',
    models: [],
  })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.logout(req, res);
  }

  @Post('register')
  @CommonDoc({
    title: 'Регистрация',
    models: [],
    queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей регистрации',
      type: '[AuthDto]',
      example: { username: '...', password: '...' },
    }],
  })
  async register(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    console.log('-- authDto', authDto);
    console.log('-- subject', subject);
    return await this.formsAuthService.register(authDto, subject, req, res);
  }

  @Post('reset')
  @CommonDoc({
    title: 'Запрос на сброс пароля пользователя',
    models: [],
    queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей регистрации',
      type: '[AuthDto]',
      example: [{ username: '...' }],
    }],
  })
  async reset(
    @Body() authDto: AuthDto,
    @Body('subject') subject: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.reset(authDto, subject, req, res);
  }
}
