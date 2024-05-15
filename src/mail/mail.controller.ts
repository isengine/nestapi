import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MailDto } from '@src/mail/mail.dto';
import { MailService } from '@src/mail/mail.service';
import { ApiExcludeController } from '@nestjs/swagger';

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

  @Post('sendtemplate')
  @UseInterceptors(FilesInterceptor('file'))
  async sendTemplate(
    @Body('options') options: MailDto,
    @Body('data') data: object,
    @Body('links') links: object,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.mailService.sendTemplate(
      options,
      data,
      links,
      files,
    );
  }
}
