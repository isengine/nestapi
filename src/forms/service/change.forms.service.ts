import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { HelpersFormsService } from '@src/forms/service/helpers.forms.service';

@Injectable()
export class ChangeFormsService {
  constructor(
    private readonly authService: AuthService,
    private readonly helpersService: HelpersFormsService,
  ) {}

  async change(req, res): Promise<void> {
    const { body } = req;
    const {
      username = '',
      password = '',
      code = '',
    } = body;

    let error;

    const result = await this.authService.restore({
      username,
      password,
    }, code)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await this.helpersService.redirect(req, res, error);
    }

    const uri = '/forms/change_complete.html';
    return await this.helpersService.query(req, res, uri);
  }
}
