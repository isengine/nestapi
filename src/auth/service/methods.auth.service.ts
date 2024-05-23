import { Injectable } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';

import { ChangeMethodsHandler } from '@src/auth/handler/methods/change.methods.handler';
import { ConfirmMethodsHandler } from '@src/auth/handler/methods/confirm.methods.handler';
import { LoginMethodsHandler } from '@src/auth/handler/methods/login.methods.handler';
import { LogoutMethodsHandler } from '@src/auth/handler/methods/logout.methods.handler';
import { RegisterMethodsHandler } from '@src/auth/handler/methods/register.methods.handler';
import { RestoreMethodsHandler } from '@src/auth/handler/methods/restore.methods.handler';

@Injectable()
export class MethodsAuthService {
  constructor(
    protected readonly changeMethodsHandler: ChangeMethodsHandler,
    protected readonly confirmMethodsHandler: ConfirmMethodsHandler,
    protected readonly loginMethodsHandler: LoginMethodsHandler,
    protected readonly logoutMethodsHandler: LogoutMethodsHandler,
    protected readonly registerMethodsHandler: RegisterMethodsHandler,
    protected readonly restoreMethodsHandler: RestoreMethodsHandler,
  ) {}

  async confirm(code: string): Promise<boolean> {
    return await this.confirmMethodsHandler.confirm(code);
  }

  async login(authDto: AuthDto, request: any = null): Promise<AuthEntity> {
    return await this.loginMethodsHandler.login(authDto, request);
  }

  async logout(request: any = null): Promise<boolean> {
    return await this.logoutMethodsHandler.logout(request);
  }

  async register(authDto: AuthDto): Promise<AuthEntity> {
    return await this.registerMethodsHandler.register(authDto);
  }

  async change(authDto: AuthDto, code: string): Promise<boolean> {
    return await this.changeMethodsHandler.change(authDto, code);
  }

  async restore(authDto: AuthDto): Promise<boolean> {
    return await this.restoreMethodsHandler.restore(authDto);
  }
}
