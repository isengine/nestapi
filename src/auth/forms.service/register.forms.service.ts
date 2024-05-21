import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { MailService } from '@src/mail/mail.service';
import { TokenService } from '@src/token/token.service';
import { HelpersFormsService } from '@src/auth/forms.service/helpers.forms.service';

@Injectable()
export class RegisterFormsService {
  constructor(
    private readonly authService: AuthService,
    private readonly authConfirmService: AuthConfirmService,
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

    const token = await this.tokenService.pair({ id: auth.id });
    // if (request) {
    //   await this.authSessionsService.start(auth, token, request);
    // }

    // закомментируйте строки ниже, если пользователь будет сразу же активирован
    // используйте generate чтобы генерировать код из цифр
    const confirm = await this.authConfirmService.create(auth);

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
