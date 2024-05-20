import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { ConfirmService } from '@src/confirm/confirm.service';
import { MailService } from '@src/mail/mail.service';
import { TokenService } from '@src/token/token.service';
import { HelpersFormsService } from '@src/forms/service/helpers.service';

@Injectable()
export class RegisterFormsService {
  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly helpersService: HelpersFormsService,
  ) {}

  async register(req, res): Promise<any> {
    const { body } = req;
    const {
      username = '',
      password = '',
      subject = '',
    } = body;

    let error;

    const auth = await this.authService.register({
      username,
      password,
    })
      .catch((e) => {
        error = e?.response;
      });

    if (!auth) {
      return await this.helpersService.redirect(req, res, error);
    }

    const token = await this.tokenService.tokenCreatePair({ id: auth.id });
    // if (request) {
    //   await this.sessionsService.createSession(auth, token, request);
    // }

    // закомментируйте строки ниже, если пользователь будет сразу же активирован
    // используйте confirmGenerate чтобы генерировать код из цифр
    const confirm = await this.confirmService.confirmCreate(auth);

    await this.mailService.sendTemplate(
      {
        to: username,
        subject: subject,
        template: 'register',
      },
      {
      },
      {
        url: `/forms/confirm.html?code=${confirm.code}`,
      },
    );

    return token;
  }
}
