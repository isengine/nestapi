import { Injectable } from '@nestjs/common';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { MailService } from '@src/mail/mail.service';
import { redirect, query } from '@src/auth/handler/forms/helpers.forms.handler';

@Injectable()
export class ResetFormsHandler {
  constructor(
    private readonly methodsAuthService: MethodsAuthService,
    private readonly authConfirmService: AuthConfirmService,
    private readonly mailService: MailService,
  ) {}

  async reset(req, res): Promise<any> {
    const { body } = req;
    const {
      username = '',
      subject = '',
    } = body;

    let error;

    const result = await this.methodsAuthService.reset({
      username,
    })
      .catch((e) => {
        error = e?.response;
      });

    // console.log('-- reset...');
    // console.log('-- result', result);

    if (!result) {
      return await redirect(req, res, error);
    }

    const { code = undefined } = await this.authConfirmService.findByUsername(
      username,
      'reset',
    );

    if (!code) {
      return await redirect(req, res, error);
    }

    await this.mailService.sendTemplate(
      {
        to: username,
        subject: subject,
        template: 'reset',
      },
      {
      },
      {
        url: `/auth/change.html?code=${code}`,
      },
    );

    const uri = '/auth/reset_complete.html';
    return await query(req, res, uri);
  }
}
