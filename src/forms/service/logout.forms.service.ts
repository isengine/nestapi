import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { HelpersFormsService } from '@src/forms/service/helpers.forms.service';

@Injectable()
export class LogoutFormsService {
  constructor(
    private readonly authService: AuthService,
    private readonly helpersService: HelpersFormsService,
  ) {}

  async logout(req, res): Promise<void> {
    let error;

    const result = await this.authService.logout(req)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await this.helpersService.redirect(req, res, error);
    }

    const uri = '/forms/auth.html';
    return await this.helpersService.query(req, res, uri);
  }
}
