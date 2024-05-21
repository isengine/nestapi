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
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Data } from '@src/common/common.decorator';
import { CommonDoc } from '@src/common/common.doc';
import { AuthFormsService } from '@src/auth/forms.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFormsService: AuthFormsService,
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
    return await this.authFormsService.change(req, res);
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
    return await this.authFormsService.confirm(req, res);
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
    return await this.authFormsService.login(req, res);
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
    return await this.authFormsService.register(req, res);
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
    return await this.authFormsService.register(req, res);
  }

  @Post('restore')
  @CommonDoc({
    title: 'Запрос на смену пароля пользователя',
    models: [],
    queries: [{
      name: 'authDto',
      required: true,
      description: 'Объект полей регистрации',
      type: '[AuthDto]',
      example: [{ username: '...' }],
    }],
  })
  async restore(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.authFormsService.restore(req, res);
  }

  @Auth()
  @Get('self')
  @ApiExcludeEndpoint()
  async self(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authService.findOne(id, [{ name: 'users' }, { name: 'strategies' }]);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
