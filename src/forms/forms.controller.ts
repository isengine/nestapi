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
  async authService(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.formsService.auth(req, res);
  }

  @Get('auth.html')
  @Render('auth')
  auth(@Req() req: any) {
    return { query: req.query };
  }

  @Get('register.html')
  @Render('register')
  register(@Req() req: any) {
    return { query: req.query };
  }

  @Get('restore.html')
  @Render('restore')
  restore(@Req() req: any) {
    return { query: req.query };
  }

  @Get('confirm.html')
  @Render('confirm')
  confirm(@Req() req: any) {
    return { query: req.query };
  }
}
