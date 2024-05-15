import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const getMailConfig = async (
  configService: ConfigService,
): Promise<any> => {
  const domain = configService.get<string>('DOMAIN');

  const host = configService.get<string>('SMTP_HOST');
  const port = configService.get<string>('SMTP_PORT');
  const user = configService.get<string>('SMTP_USER');
  const password = configService.get<string>('SMTP_PASSWORD');
  const secure = configService.get<boolean>('SMTP_SECURE');

  const senderName = configService.get<string>('SMTP_SENDER_NAME');
  const senderEmail = configService.get<string>('SMTP_SENDER_EMAIL');

  const from = senderName ? `"${senderName}" <${senderEmail}>` : senderEmail;
  const transport = `${
    secure ? 'smtps' : 'smtp'
  }://${user}:${password}@${host}:${port}`;

  return {
    transport,
    defaults: {
      from,
    },
    template: {
      dir: join(__dirname, '..', '..', 'views/mail'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
    options: {
      partials: {
        dir: join(__dirname, '..', '..', 'views/mail/partials'),
        options: {
          strict: true,
        },
      },
    },
  };
};
