import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { FilesInterface } from '@src/files/files.interface';
import { AttachmentsMailInterface } from './interface/attachments.mail.interface';
import { MailDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(options: MailDto, files: FilesInterface[] = undefined) {
    const attachments = await this.attachments(files);
    const result = await this.mailerService
      .sendMail({
        to: options.to,
        subject: options.subject,
        // template: 'application-approved',
        // context: {
        //   content: options.html || options.text,
        // },
        attachments,
        text: options.text,
        html: options.html,
      })
      .catch((e) => {
        console.error('send mail error:', e);
      });
    return result;
  }

  async sendByTemplate(
    options: MailDto,
    data: object,
    files: FilesInterface[] = undefined,
  ) {
    const attachments = await this.attachments(files);

    const result = await this.mailerService
      .sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: {
          data,
        },
        attachments,
      })
      .catch((e) => {
        console.error('send mail with template error:', e);
      });
    return result;
  }

  async attachments(
    files: FilesInterface[],
  ): Promise<AttachmentsMailInterface[]> {
    const attachments: AttachmentsMailInterface[] = await Promise.all(
      files && files.length
        ? files?.map(
            async (file): Promise<AttachmentsMailInterface> => ({
              filename: file.originalname,
              content: file.buffer.toString('base64'),
              encoding: 'base64',
              contentType: file.mimetype,
            }),
          )
        : [],
    );
    return attachments;
  }
}
