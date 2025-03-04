import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthConfirmService } from '@src/auth/auth_confirm/auth_confirm.service';
import { AuthService } from '@src/auth/auth.service';
import { MailService } from '@src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetAuthHandler {
  constructor(
    protected readonly authService: AuthService,
    protected readonly authConfirmService: AuthConfirmService,
    protected readonly configService: ConfigService,
    protected readonly mailService: MailService,
  ) {}

  async confirmCreate(authDto: AuthDto): Promise<any> {
    const auth = await this.authService.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    return await this.authConfirmService.create(auth, 'reset');
  }

  async sendMail(
    username: string,
    subject: string,
    code: string,
  ): Promise<void> {
    const url = this.configService.get('FORM_CHANGE');
    await this.mailService.sendByTemplate(
      {
        to: username,
        subject,
        template: 'reset',
      },
      {
        url: `${url}?code=${code}`,
      },
    );
  }
}
