import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { HelpersFormsService } from '@src/forms/service/helpers.forms.service';

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

    /*
    const { body, headers, protocol } = req;
    const base = `${protocol}://${headers.host}`;
    const url = `${base}/auth/confirm/${body.code}`;
    const result = await axios({
      url,
      method: 'get',
      withCredentials: true,
    })
      .then((r) => r?.data)
      .catch(async (e) => {
        return await this.helpersService.redirect(req, res, e?.response?.data);
      });
    */

    if (!result) {
      return await this.helpersService.redirect(req, res, error);
    }

    const uri = '/forms/confirm_complete.html';
    return await this.helpersService.query(req, res, uri);
  }
}
