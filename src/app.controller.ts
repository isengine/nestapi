import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from '@src/app.service';
import { join } from 'path';
import { Hidden, SimpleHidden } from './common/common.decorator';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  hello(): string {
    return this.appService.hello();
  }

  @SimpleHidden()
  @Get('test')
  @Header('Content-Type', 'application/json')
  test() {
    return JSON.stringify({
      dir: join(__dirname),
      prefix: join(this.configService.get<string>('PREFIX')),
      rootPath: join(this.configService.get<string>('ROOT_PATH')),
      uploadsPath: join(this.configService.get<string>('UPLOADS_PATH')),
      views: join(this.configService.get<string>('ROOT_PATH'), 'views/mail'),
    });
  }

  @Hidden()
  @Get('test/hidden')
  @Header('Content-Type', 'application/json')
  hidden() {
    return { status: 'ok' };
  }
}
