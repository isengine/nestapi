import { Injectable } from '@nestjs/common';
import { ChangeMethodsHandler } from '@src/auth/handler/methods/change.methods.handler';
import { ConfirmMethodsHandler } from '@src/auth/handler/methods/confirm.methods.handler';
import { LoginFormsHandler } from '@src/auth/handler/forms/login.forms.handler';
import { LogoutFormsHandler } from '@src/auth/handler/forms/logout.forms.handler';
import { RegisterFormsHandler } from '@src/auth/handler/forms/register.forms.handler';
import { ResetFormsHandler } from '@src/auth/handler/forms/reset.forms.handler';
import { redirect, query } from '@src/auth/handler/forms/helpers.forms.handler';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';
import { AuthDto } from '@src/auth/auth.dto';

@Injectable()
export class FormsAuthService {
  constructor(
    protected readonly changeMethodsHandler: ChangeMethodsHandler,
    protected readonly confirmMethodsHandler: ConfirmMethodsHandler,
    private readonly loginFormsHandler: LoginFormsHandler,
    private readonly logoutFormsHandler: LogoutFormsHandler,
    private readonly registerFormsHandler: RegisterFormsHandler,
    private readonly resetFormsHandler: ResetFormsHandler,
  ) {}

  async change(authDto: AuthDto, code: string, req, res): Promise<void> {
    let error;

    const result = await this.changeMethodsHandler.change(authDto, code)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await redirect(req, res, error);
    }

    const uri = '/auth/change_complete.html';
    return await query(req, res, uri);
  }

  async confirm(code: string, req, res): Promise<void> {
    let error = {
      error: 'Bad request',
      message: 'Invalid confirm code',
    };

    const result = await this.confirmMethodsHandler.confirm(code)
      .catch((e) => {
        error = e?.response;
      });

    if (!result) {
      return await redirect(req, res, error);
    }

    const uri = '/auth/confirm_complete.html';
    return await query(req, res, uri);
  }

  async login(req, res): Promise<void> {
    return await this.loginFormsHandler.login(req, res);
  }

  async logout(req, res): Promise<void> {
    return await this.logoutFormsHandler.logout(req, res);
  }

  async register(req, res): Promise<any> {
    return await this.registerFormsHandler.register(req, res);
  }

  async reset(req, res): Promise<any> {
    return await this.resetFormsHandler.reset(req, res);
  }
}
