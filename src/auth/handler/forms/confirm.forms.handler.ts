import { Injectable } from '@nestjs/common';
import { redirect, query } from '@src/auth/handler/forms/helpers.handler';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';

@Injectable()
export class ConfirmFormsHandler {
  constructor(
    private readonly methodsAuthService: MethodsAuthService,
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

    const result = await this.methodsAuthService.confirm(code)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await redirect(req, res, error);
    }

    const uri = '/auth/confirm_complete.html';
    return await query(req, res, uri);
  }
}
