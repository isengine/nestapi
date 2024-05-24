import { Injectable } from '@nestjs/common';
import { ChangeAuthHandler } from '@src/auth/handler/change.auth.handler';
import { ConfirmAuthHandler } from '@src/auth/handler/confirm.auth.handler';
import { LogoutAuthHandler } from '@src/auth/handler/logout.auth.handler';
import { RegisterAuthHandler } from '@src/auth/handler/register.auth.handler';
import { ResetAuthHandler } from '@src/auth/handler/reset.auth.handler';
import { redirect, query } from '@src/auth/helpers/forms.auth.helpers';
import { AuthDto } from '@src/auth/auth.dto';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { GrantsTokenService } from '@src/token/service/grants.token.service';

@Injectable()
export class FormsAuthService {
  constructor(
    protected readonly changeAuthHandler: ChangeAuthHandler,
    protected readonly confirmAuthHandler: ConfirmAuthHandler,
    protected readonly logoutAuthHandler: LogoutAuthHandler,
    protected readonly registerAuthHandler: RegisterAuthHandler,
    protected readonly resetAuthHandler: ResetAuthHandler,
    protected readonly grantsTokenService: GrantsTokenService,
  ) {}

  async change(authDto: AuthDto, code: string, req, res): Promise<void> {
    let error;
    const result = await this.changeAuthHandler.change(authDto, code)
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
    const result = await this.confirmAuthHandler.confirm(code)
      .catch((e) => {
        error = e?.response;
      });
    if (!result) {
      return await redirect(req, res, error);
    }
    const uri = '/auth/confirm_complete.html';
    return await query(req, res, uri);
  }

  async login(grantsTokenDto: GrantsTokenDto, response_type: string, req, res): Promise<void> {
    let error = {
      error: 'Unauthorized',
      message: 'Unknown error',
    };
    const { redirect_uri, client_id } = grantsTokenDto;
    const token = await this.grantsTokenService.password(grantsTokenDto, req, res)
      .catch((e) => {
        error = e?.response;
      });
    if (!token) {
      return await redirect(req, res, error);
    }
    if (!redirect_uri || !client_id || !response_type) {
      return token;
    }
    const uri = `/auth?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
    return await query(req, res, uri);
  }

  async logout(req, res): Promise<void> {
    let error;
    const result = await this.logoutAuthHandler.logout(req)
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
    const auth = await this.registerAuthHandler.authCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!auth) {
      return await redirect(req, res, error);
    }
    await this.registerAuthHandler.sendMail(auth, subject);
    const uri = '/auth/register_complete.html';
    return await query(req, res, uri);
  }

  async reset(authDto: AuthDto, subject: string, req, res): Promise<any> {
    let error;
    const confirm = await this.resetAuthHandler.confirmCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!confirm?.code) {
      return await redirect(req, res, error);
    }
    await this.resetAuthHandler.sendMail(authDto.username, subject, confirm.code);
    const uri = '/auth/reset_complete.html';
    return await query(req, res, uri);
  }
}
