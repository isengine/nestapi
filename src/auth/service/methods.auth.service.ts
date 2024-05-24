import { Injectable } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';

import { ChangeAuthHandler } from '@src/auth/handler/change.auth.handler';
import { ConfirmAuthHandler } from '@src/auth/handler/confirm.auth.handler';
import { LogoutAuthHandler } from '@src/auth/handler/logout.auth.handler';
import { RegisterAuthHandler } from '@src/auth/handler/register.auth.handler';
import { ResetAuthHandler } from '@src/auth/handler/reset.auth.handler';

@Injectable()
export class MethodsAuthService {
  constructor(
    protected readonly changeAuthHandler: ChangeAuthHandler,
    protected readonly confirmAuthHandler: ConfirmAuthHandler,
    protected readonly logoutAuthHandler: LogoutAuthHandler,
    protected readonly registerAuthHandler: RegisterAuthHandler,
    protected readonly resetAuthHandler: ResetAuthHandler,
  ) {}

  async change(authDto: AuthDto, code: string): Promise<boolean> {
    return await this.changeAuthHandler.change(authDto, code);
  }

  async confirm(code: string): Promise<boolean> {
    return await this.confirmAuthHandler.confirm(code);
  }

  async logout(request: any = null, response: any = null): Promise<boolean> {
    return await this.logoutAuthHandler.logout(request, response);
  }

  async register(authDto: AuthDto, subject: string, request: any = null): Promise<boolean> {
    const auth = await this.registerAuthHandler.authCreate(authDto);
    await this.registerAuthHandler.sendMail(auth, subject);
    return !!auth;
  }

  async reset(authDto: AuthDto, subject: string): Promise<boolean> {
    const confirm = await this.resetAuthHandler.confirmCreate(authDto);
    await this.resetAuthHandler.sendMail(authDto.username, subject, confirm.code);
    return !!confirm?.code;
  }
}
