import { Controller, Get, Post, Render, Res, Req } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfirmService } from '@src/confirm/confirm.service';
import { FormsService } from '@src/forms/forms.service';
import { CommonDoc } from '@src/common/common.doc';
import { Auth } from '@src/auth/auth.decorator';

@ApiTags('Формы')
@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly confirmService: ConfirmService,
  ) {}

  @Post('auth')
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
  async auth(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.auth(req, res);
  }

  @Get('auth.html')
  @Render('auth')
  @ApiExcludeEndpoint()
  authRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Вход',
    };
  }

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
    return await this.formsService.change(req, res);
  }

  @Get('change.html')
  @Render('change')
  @ApiExcludeEndpoint()
  changeRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Смена пароля',
    };
  }

  @Get('change_complete.html')
  @Render('change_complete')
  @ApiExcludeEndpoint()
  changeCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Смена пароля',
    };
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
    return await this.formsService.confirm(req, res);
  }  

  @Get('confirm.html')
  @Render('confirm')
  @ApiExcludeEndpoint()
  confirmRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Подтверждение регистрации',
    };
  }

  @Get('confirm_complete.html')
  @Render('confirm_complete')
  @ApiExcludeEndpoint()
  confirmCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Подтверждение регистрации',
    };
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
    return await this.formsService.register(req, res);
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
    return await this.formsService.register(req, res);
  }

  @Get('register.html')
  @Render('register')
  @ApiExcludeEndpoint()
  registerRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Регистрация',
    };
  }

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
  @Post('restore')
  async restore(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.restore(req, res);
  }  
  
  @Get('restore.html')
  @Render('restore')
  @ApiExcludeEndpoint()
  restoreRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Сброс пароля',
    };
  }

  @Get('restore_complete.html')
  @Render('restore_complete')
  @ApiExcludeEndpoint()
  restoreCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Сброс пароля',
    };
  }
}
