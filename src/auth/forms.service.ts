import { Injectable } from '@nestjs/common';
import { ChangeFormsService } from '@src/auth/forms.service/change.forms.service';
import { ConfirmFormsService } from '@src/auth/forms.service/confirm.forms.service';
import { LoginFormsService } from '@src/auth/forms.service/login.forms.service';
import { LogoutFormsService } from '@src/auth/forms.service/logout.forms.service';
import { RegisterFormsService } from '@src/auth/forms.service/register.forms.service';
import { RestoreFormsService } from '@src/auth/forms.service/restore.forms.service';

@Injectable()
export class AuthFormsService {
  constructor(
    private readonly changeFormsService: ChangeFormsService,
    private readonly confirmFormsService: ConfirmFormsService,
    private readonly loginFormsService: LoginFormsService,
    private readonly logoutFormsService: LogoutFormsService,
    private readonly registerFormsService: RegisterFormsService,
    private readonly restoreFormsService: RestoreFormsService,
  ) {}

  async change(req, res): Promise<void> {
    return await this.changeFormsService.change(req, res);
  }

  async confirm(req, res): Promise<void> {
    return await this.confirmFormsService.confirm(req, res);
  }

  async login(req, res): Promise<void> {
    return await this.loginFormsService.login(req, res);
  }

  async logout(req, res): Promise<void> {
    return await this.logoutFormsService.logout(req, res);
  }

  async register(req, res): Promise<any> {
    return await this.registerFormsService.register(req, res);
  }

  async restore(req, res): Promise<any> {
    return await this.restoreFormsService.restore(req, res);
  }
}
