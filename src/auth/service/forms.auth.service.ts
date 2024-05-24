import { Injectable } from '@nestjs/common';
import { ChangeMethodsHandler } from '@src/auth/handler/methods/change.methods.handler';
import { ConfirmMethodsHandler } from '@src/auth/handler/methods/confirm.methods.handler';
import { LoginFormsHandler } from '@src/auth/handler/forms/login.forms.handler';
import { LogoutMethodsHandler } from '@src/auth/handler/methods/logout.methods.handler';
import { RegisterMethodsHandler } from '@src/auth/handler/methods/register.methods.handler';
import { ResetMethodsHandler } from '@src/auth/handler/methods/reset.methods.handler';
import { redirect, query } from '@src/auth/handler/forms/helpers.forms.handler';
import { AuthDto } from '@src/auth/auth.dto';

@Injectable()
export class FormsAuthService {
  constructor(
    protected readonly changeMethodsHandler: ChangeMethodsHandler,
    protected readonly confirmMethodsHandler: ConfirmMethodsHandler,
    private readonly loginFormsHandler: LoginFormsHandler,
    protected readonly logoutMethodsHandler: LogoutMethodsHandler,
    protected readonly registerMethodsHandler: RegisterMethodsHandler,
    protected readonly resetMethodsHandler: ResetMethodsHandler,
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
    let error;
    const result = await this.logoutMethodsHandler.logout(req)
      .catch((e) => {
        error = e?.response;
      });
    if (!result) {
      return;
    }
    const uri = '/auth/auth.html';
    return await query(req, res, uri);
  }

  async register(authDto: AuthDto, subject: string, req, res): Promise<any> {
    let error;
    const auth = await this.registerMethodsHandler.authCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!auth) {
      return await redirect(req, res, error);
    }
    await this.registerMethodsHandler.sendMail(auth, subject);
    return await this.registerMethodsHandler.tokenCreate(auth, req);
  }

  async reset(authDto: AuthDto, subject: string, req, res): Promise<any> {
    let error;
    const confirm = await this.resetMethodsHandler.confirmCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!confirm?.code) {
      return await redirect(req, res, error);
    }
    await this.resetMethodsHandler.sendMail(authDto.username, subject, confirm.code);
    const uri = '/auth/reset_complete.html';
    return await query(req, res, uri);
  }
}
