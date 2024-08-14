import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Cookie } from '@src/common/service/cookie.service';
import { ConfigService } from '@nestjs/config';

@ApiExcludeController()
@Controller('auth')
export class RenderAuthController {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  @Get('auth.html')
  @Render('auth')
  authRender(
    @Req() req: any,
    @Res() res: any,
  ) {
    const cookie = new Cookie(req, res);
    cookie.setJson('query', req.query);
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      strategies: req.query?.strategies ? JSON.parse(req.query?.strategies || []) : [],
      title: 'Вход',
    };
  }

  @Get('change.html')
  @Render('change')
  changeRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Смена пароля',
    };
  }

  @Get('change_complete.html')
  @Render('change_complete')
  changeCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Смена пароля',
    };
  }

  @Get('confirm.html')
  @Render('confirm')
  confirmRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Подтверждение регистрации',
    };
  }

  @Get('confirm_complete.html')
  @Render('confirm_complete')
  confirmCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Подтверждение регистрации',
    };
  }

  @Get('register.html')
  @Render('register')
  registerRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Регистрация',
    };
  }

  @Get('register_complete.html')
  @Render('register_complete')
  registerCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Регистрация',
    };
  }

  @Get('reset.html')
  @Render('reset')
  resetRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Сброс пароля',
    };
  }

  @Get('reset_complete.html')
  @Render('reset_complete')
  resetCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      prefix: this.configService.get('PREFIX'),
      title: 'Сброс пароля',
    };
  }
}
