import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from '@src/app.service';
import { join } from 'path';

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

  @Get('test/:secret')
  @Header('Content-Type', 'application/json')
  test(@Param('secret') secret: string): string {
    const key = this.configService.get<string>('AES_SECRET');
    if (secret !== key) {
      throw new NotFoundException('Not found');
    }
    return JSON.stringify({
      dir: join(__dirname),
      prefix: join(this.configService.get<string>('PREFIX')),
      rootPath: join(this.configService.get<string>('ROOT_PATH')),
      uploadsPath: join(this.configService.get<string>('UPLOADS_PATH')),
      views: join(this.configService.get<string>('ROOT_PATH'), 'views/mail'),
    });
  }
}
