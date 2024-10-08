import { Injectable } from '@nestjs/common';
import { MailDto } from '@src/mail/mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { FilesInterface } from '@src/files/files.interface';
import { AttachmentsMailInterface } from '@src/mail/interface/attachments.mail.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

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

  async sendTemplate(
    options: MailDto,
    data: object,
    links: object,
    files: FilesInterface[] = undefined,
  ) {
    const linksData = await this.links(links);
    const attachments = await this.attachments(files);

    const result = await this.mailerService
      .sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: {
          data,
          links: linksData,
        },
        attachments,
      })
      .catch((e) => {
        console.error('send mail with template error:', e);
      });
    return result;
  }

  async attachments(files: FilesInterface[]): Promise<AttachmentsMailInterface[]> {
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

  links(links: object): object {
    const domain = this.configService.get('SMTP_LINKS_DOMAIN');

    const result: object = {};
    Object.entries(links)?.map(
      ([key, path]): void => {
        result[key] = `${domain}${path}`;
      }
    );
    return result;
  }
}
