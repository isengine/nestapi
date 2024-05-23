import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { HelpersFormsService } from '@src/auth/forms.service/helpers.forms.service';

@Injectable()
export class ConfirmFormsService {
  constructor(
    private readonly authService: AuthService,
    private readonly helpersService: HelpersFormsService,
  ) {}
  
  async confirm(req, res): Promise<void> {
    const { body } = req;
    const {
      code = '',
    } = body;

    let error = {
      error: 'Bad request',
      message: 'Invalid confirm code',
    };

    const result = await this.authService.confirm(code)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await this.helpersService.redirect(req, res, error);
    }

    const uri = '/auth/confirm_complete.html';
    return await this.helpersService.query(req, res, uri);
  }
}
