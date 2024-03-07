import { Controller, Get, Header, Render, Req } from '@nestjs/common';
import { AppService } from '@src/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('form/login.html')
  @Render('login')
  login(@Req() req: any) {
    return { query: req.query };
  }

  @Get('form/register.html')
  @Render('register')
  register(@Req() req: any) {
    return { query: req.query };
  }

  @Get()
  @Header('Content-Type', 'application/json')
  hello(): string {
    return this.appService.hello();
  }
}
