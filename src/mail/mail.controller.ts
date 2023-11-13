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

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseInterceptors(FilesInterceptor('file'))
  async mailSend(
    @Body('options') options: MailDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // in form as options[...] = ...
    // file in form as file[] = ...
    const result = this.mailService.mailSend(options, files);
    return result;
  }
}
