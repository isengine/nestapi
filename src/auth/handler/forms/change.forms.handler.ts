import { Injectable } from '@nestjs/common';
import { redirect, query } from '@src/auth/handler/forms/helpers.handler';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';

@Injectable()
export class ChangeFormsHandler {
  constructor(
    private readonly methodsAuthService: MethodsAuthService,
  ) {}

  async change(req, res): Promise<void> {
    const { body } = req;
    const {
      username = '',
      password = '',
      code = '',
    } = body;

    let error;

    const result = await this.methodsAuthService.change({
      username,
      password,
    }, code)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await redirect(req, res, error);
    }

    const uri = '/auth/change_complete.html';
    return await query(req, res, uri);
  }
}
