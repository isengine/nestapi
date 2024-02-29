import { Injectable } from '@nestjs/common';
import { MailDto } from '@src/mail/mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { FilesInterface } from '@src/files/files.interface';
import { mailAttachmentsInterface } from '@src/mail/mail.attachments.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async mailSend(options: MailDto, files: FilesInterface[]) {
    const attachments: mailAttachmentsInterface[] = await Promise.all(
      files && files.length
        ? files?.map(
            async (file): Promise<mailAttachmentsInterface> => ({
              filename: file.originalname,
              content: file.buffer.toString('base64'),
              encoding: 'base64',
              contentType: file.mimetype,
            }),
          )
        : [],
    );

    const result = await this.mailerService
      .sendMail({
        to: options.to,
        subject: options.subject,
        template: 'application-approved',
        // context: {
        //   content: options.html || options.text,
        // },
        attachments,
        text: options.text,
        html: options.html,
      })
      .catch((e) => {
        console.error('sendMail error', e);
      });
    return result;
  }
}
