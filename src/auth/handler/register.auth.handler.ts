import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthConfirmService } from '@src/auth/auth_confirm/auth_confirm.service';
import { HashAuthHandler } from '@src/auth/handler/hash.auth.handler';
import { MailService } from '@src/mail/mail.service';

@Injectable()
export class RegisterAuthHandler {
  constructor(
    protected readonly authService: AuthService,
    protected readonly authConfirmService: AuthConfirmService,
    protected readonly configService: ConfigService,
    protected readonly mailService: MailService,
    protected readonly hashAuthHandler: HashAuthHandler,
  ) {}

  async authCreate(authDto: AuthDto): Promise<AuthEntity> {
    const authExists = await this.authService.findByUsername(authDto.username);
    if (authExists) {
      if (+authExists.isActivated) {
        throw new BadRequestException(
          'User with this username is already in the system',
        );
      }
      return authExists;
    }
    authDto.password = await this.hashAuthHandler.generate(authDto.password);

    // используйте данную строку, если пользователь будет сразу же активирован
    // authDto.isActivated = true;

    return await this.authService.create(authDto);
  }

  async sendMail(auth: AuthDto, subject): Promise<void> {
    const { username } = auth;

    // закомментируйте строки ниже, если пользователь будет сразу же активирован
    // используйте generate чтобы генерировать код из цифр
    const confirm = await this.authConfirmService.create(auth);
    const url = this.configService.get('FORM_CONFIRM');

    await this.mailService.sendByTemplate(
      {
        to: username,
        subject,
        template: 'register',
      },
      {
        url: `${url}?code=${confirm.code}`,
      },
    );
  }
}
