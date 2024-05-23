import { Injectable } from '@nestjs/common';
import { ChangeFormsHandler } from '@src/auth/handler/forms/change.forms.handler';
import { ConfirmFormsHandler } from '@src/auth/handler/forms/confirm.forms.handler';
import { LoginFormsHandler } from '@src/auth/handler/forms/login.forms.handler';
import { LogoutFormsHandler } from '@src/auth/handler/forms/logout.forms.handler';
import { RegisterFormsHandler } from '@src/auth/handler/forms/register.forms.handler';
import { ResetFormsHandler } from '@src/auth/handler/forms/reset.forms.handler';

@Injectable()
export class FormsAuthService {
  constructor(
    private readonly changeFormsHandler: ChangeFormsHandler,
    private readonly confirmFormsHandler: ConfirmFormsHandler,
    private readonly loginFormsHandler: LoginFormsHandler,
    private readonly logoutFormsHandler: LogoutFormsHandler,
    private readonly registerFormsHandler: RegisterFormsHandler,
    private readonly resetFormsHandler: ResetFormsHandler,
  ) {}

  async change(req, res): Promise<void> {
    return await this.changeFormsHandler.change(req, res);
  }

  async confirm(req, res): Promise<void> {
    return await this.confirmFormsHandler.confirm(req, res);
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
