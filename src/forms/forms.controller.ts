import { Controller, Get, Post, Render, Res, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { FormsService } from '@src/forms/forms.service';

@ApiExcludeController()
@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
  ) {}

  @Post('auth')
  async auth(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.auth(req, res);
  }

  @Get('auth.html')
  @Render('auth')
  authRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Вход',
    };
  }

  @Post('change')
  async change(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.change(req, res);
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

  @Post('confirm')
  async confirm(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.confirm(req, res);
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

  @Get('confirm_fail.html')
  @Render('confirm_fail')
  confirmFailRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Подтверждение регистрации',
    };
  }

  @Post('register')
  async register(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.register(req, res);
  }

  @Get('register.html')
  @Render('register')
  registerRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Регистрация',
    };
  }

  @Post('restore')
  async restore(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.restore(req, res);
  }  
  
  @Get('restore.html')
  @Render('restore')
  restoreRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Восстановление пароля',
    };
  }

  @Get('restore_complete.html')
  @Render('restore_complete')
  restoreCompleteRender(@Req() req: any) {
    return {
      query: req.query,
      title: 'Восстановление пароля',
    };
  }
}
