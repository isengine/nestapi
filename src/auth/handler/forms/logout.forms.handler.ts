import { Injectable } from '@nestjs/common';
import { redirect, query } from '@src/auth/handler/forms/helpers.forms.handler';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';

@Injectable()
export class LogoutFormsHandler {
  constructor(
    private readonly methodsAuthService: MethodsAuthService,
  ) {}

  async logout(req, res): Promise<void> {
    let error;

    const result = await this.methodsAuthService.logout(req)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await redirect(req, res, error);
    }

    const uri = '/auth/auth.html';
    return await query(req, res, uri);
  }
}
