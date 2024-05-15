import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '@src/mail/mail.service';
import { MailController } from '@src/mail/mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailConfig } from '@src/config/mail.config';

@Module({
  controllers: [MailController],
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
