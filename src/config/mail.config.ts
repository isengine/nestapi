import { ConfigService } from '@nestjs/config';

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

  const from = senderName ? `"${senderName}" <${senderEmail}>` : senderEmail;
  const transport = `${
    secure ? 'smtps' : 'smtp'
  }://${user}:${password}@${host}:${port}`;

  return {
    transport,
    defaults: {
      from,
    },
    // template: {
    //   adapter: new EjsAdapter(),
    //   options: {
    //     strict: false,
    //   },
    // },
  };
};
