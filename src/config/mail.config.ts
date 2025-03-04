import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const getMailConfig = async (
  configService: ConfigService,
): Promise<any> => {
  const host = configService.get<string>('SMTP_HOST');
  const port = configService.get<string>('SMTP_PORT');
  const user = configService.get<string>('SMTP_USER');
  const password = configService.get<string>('SMTP_PASSWORD');
  const secure = configService.get<boolean>('SMTP_SECURE');

  const senderName = configService.get<string>('SMTP_SENDER_NAME');
  const senderEmail = configService.get<string>('SMTP_SENDER_EMAIL');

  const rootPath = configService.get<string>('ROOT_PATH');

  const from = senderName ? `"${senderName}" <${senderEmail}>` : senderEmail;
  const transport = `${
    secure ? 'smtps' : 'smtp'
  }://${user}:${password}@${host}:${port}`;

  return {
    transport,
    defaults: {
      from,
    },
    // preview: true,
    template: {
      dir: join(rootPath, 'views/mail'),
      adapter: new EjsAdapter(),
      options: {
        // strict: true,
        strict: false,
      },
    },
  };
};
