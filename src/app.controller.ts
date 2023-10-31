import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from '@src/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  hello(): string {
    return this.appService.hello();
  }
}
