import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
import { MailDto } from './mail.dto';
import { MailService } from './mail.service';

@ApiExcludeController()
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseInterceptors(FilesInterceptor('file'))
  async send(
    @Body('options') options: MailDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.mailService.send(options, files);
  }

  @Post('send_by_template')
  @UseInterceptors(FilesInterceptor('file'))
  async sendByTemplate(
    @Body('options') options: MailDto,
    @Body('data') data: object,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.mailService.sendByTemplate(options, data, files);
  }
}
