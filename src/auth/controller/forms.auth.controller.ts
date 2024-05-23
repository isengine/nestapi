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

@ApiTags('Авторизация через формы')
@Controller('auth')
export class FormsAuthController {
  constructor(
    private readonly formsAuthService: FormsAuthService,
  ) {}

  @Post('change')
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
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.change(req, res);
  }

  @Post('confirm')
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
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.confirm(req, res);
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
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.login(req, res);
  }

  @Auth()
  @Post('logout')
  @CommonDoc({
    title: 'Выход',
    models: [],
  })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.register(req, res);
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
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.register(req, res);
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
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsAuthService.reset(req, res);
  }
}
