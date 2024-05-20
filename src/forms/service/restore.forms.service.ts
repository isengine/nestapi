import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { ConfirmService } from '@src/confirm/confirm.service';
import { MailService } from '@src/mail/mail.service';
import { HelpersFormsService } from '@src/forms/service/helpers.forms.service';

@Injectable()
export class RestoreFormsService {
  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly mailService: MailService,
    private readonly helpersService: HelpersFormsService,
  ) {}

  async restore(req, res): Promise<any> {
    const { body } = req;
    const {
      username = '',
      subject = '',
    } = body;

    let error;

    const result = await this.authService.restorePrepare({
      username,
    })
      .catch((e) => {
        error = e?.response;
      });

    // console.log('-- restorePrepare...');
    // console.log('-- result', result);

    if (!result) {
      return await this.helpersService.redirect(req, res, error);
    }

    const { code = undefined } = await this.confirmService.confirmFindByUsername(
      username,
      'restore',
    );

    if (!code) {
      return await this.helpersService.redirect(req, res, error);
    }

    await this.mailService.sendTemplate(
      {
        to: username,
        subject: subject,
        template: 'restore',
      },
      {
      },
      {
        url: `/forms/change.html?code=${code}`,
      },
    );

    const uri = '/forms/restore_complete.html';
    return await this.helpersService.query(req, res, uri);
  }
}
