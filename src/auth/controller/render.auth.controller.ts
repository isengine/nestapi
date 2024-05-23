import { Controller, Get, Render, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('auth')
export class RenderAuthController {
  constructor(
  ) {}

  @Get('auth.html')
  @Render('auth')
  authRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Вход',
    };
  }

  @Get('change.html')
  @Render('change')
  changeRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Смена пароля',
    };
  }

  @Get('change_complete.html')
  @Render('change_complete')
  changeCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Смена пароля',
    };
  }

  @Get('confirm.html')
  @Render('confirm')
  confirmRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Подтверждение регистрации',
    };
  }

  @Get('confirm_complete.html')
  @Render('confirm_complete')
  confirmCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Подтверждение регистрации',
    };
  }

  @Get('register.html')
  @Render('register')
  registerRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Регистрация',
    };
  }

  @Get('reset.html')
  @Render('reset')
  resetRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Сброс пароля',
    };
  }

  @Get('reset_complete.html')
  @Render('reset_complete')
  resetCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Сброс пароля',
    };
  }
}
