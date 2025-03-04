import { Injectable } from '@nestjs/common';
import { TypeGrants } from '@src/common/common.enum';
import { ChangeAuthHandler } from '@src/auth/handler/change.auth.handler';
import { ConfirmAuthHandler } from '@src/auth/handler/confirm.auth.handler';
import { HashAuthHandler } from '@src/auth/handler/hash.auth.handler';
import { LogoutAuthHandler } from '@src/auth/handler/logout.auth.handler';
import { RegisterAuthHandler } from '@src/auth/handler/register.auth.handler';
import { ResetAuthHandler } from '@src/auth/handler/reset.auth.handler';
import { AuthDto } from '@src/auth/auth.dto';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { GrantsTokenService } from '@src/token/service/grants.token.service';
import { OpenAuthService } from './open.auth.service';

@Injectable()
export class MethodsAuthService {
  constructor(
    protected readonly changeAuthHandler: ChangeAuthHandler,
    protected readonly confirmAuthHandler: ConfirmAuthHandler,
    protected readonly hashAuthHandler: HashAuthHandler,
    protected readonly logoutAuthHandler: LogoutAuthHandler,
    protected readonly registerAuthHandler: RegisterAuthHandler,
    protected readonly resetAuthHandler: ResetAuthHandler,
    protected readonly grantsTokenService: GrantsTokenService,
    protected readonly openAuthService: OpenAuthService,
  ) {}

  async change(authDto: AuthDto, code: string, req, res): Promise<any> {
    let error;
    const result = await this.changeAuthHandler
      .change(authDto, code)
      .catch((e) => {
        error = e?.response;
      });
    if (!result) {
      return error;
    }
    return { success: true };
  }

  async confirm(code: string, req, res): Promise<any> {
    let error = {
      error: 'Bad request',
      message: 'Invalid confirm code',
    };
    const result = await this.confirmAuthHandler.confirm(code).catch((e) => {
      error = e?.response;
    });
    if (!result) {
      return error;
    }
    return { success: true };
  }

  async login(grantsTokenDto: GrantsTokenDto, req, res): Promise<any> {
    let error = {
      error: 'Unauthorized',
      message: 'Unknown error',
    };
    grantsTokenDto.grant_type = TypeGrants.PASSWORD;
    const token = await this.grantsTokenService
      .password(grantsTokenDto, req, res)
      .catch((e) => {
        error = e?.response;
      });
    if (!token) {
      return error;
    }
    return { success: true, ...token };
  }

  async logout(req, res): Promise<any> {
    let error;
    const result = await this.logoutAuthHandler.logout(req).catch((e) => {
      error = e?.response;
    });
    if (!result) {
      return error;
    }
    return { success: true };
  }

  async register(authDto: AuthDto, subject: string, req, res): Promise<any> {
    let error;
    const auth = await this.registerAuthHandler
      .authCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!auth) {
      return error;
    }
    if (!auth.isActivated) {
      await this.registerAuthHandler.sendMail(auth, subject);
    }
    return { success: true };
  }

  async reset(authDto: AuthDto, subject: string, req, res): Promise<any> {
    let error;
    const confirm = await this.resetAuthHandler
      .confirmCreate(authDto)
      .catch((e) => {
        error = e?.response;
      });
    if (!confirm?.code) {
      return error;
    }
    await this.resetAuthHandler.sendMail(
      authDto.username,
      subject,
      confirm.code,
    );
    return { success: true };
  }

  async hash(string: string): Promise<any> {
    const hashedString = await this.hashAuthHandler.generate(string);
    return {
      success: true,
      hash: hashedString,
    };
  }
}
