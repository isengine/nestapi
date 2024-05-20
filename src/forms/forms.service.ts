import { Injectable } from '@nestjs/common';
import { AuthFormsService } from '@src/forms/service/auth.forms.service';
import { ChangeFormsService } from '@src/forms/service/change.forms.service';
import { ConfirmFormsService } from '@src/forms/service/confirm.forms.service';
import { RegisterFormsService } from '@src/forms/service/register.forms.service';
import { RestoreFormsService } from '@src/forms/service/restore.forms.service';

@Injectable()
export class FormsService {
  constructor(
    private readonly authFormsService: AuthFormsService,
    private readonly changeFormsService: ChangeFormsService,
    private readonly confirmFormsService: ConfirmFormsService,
    private readonly registerFormsService: RegisterFormsService,
    private readonly restoreFormsService: RestoreFormsService,
  ) {}

  async auth(req, res): Promise<void> {
    return await this.authFormsService.auth(req, res);
  }

  async change(req, res): Promise<void> {
    return await this.changeFormsService.change(req, res);
  }

  async confirm(req, res): Promise<void> {
    return await this.confirmFormsService.confirm(req, res);
  }

  async register(req, res): Promise<any> {
    return await this.registerFormsService.register(req, res);
  }

  async restore(req, res): Promise<any> {
    return await this.restoreFormsService.restore(req, res);
  }
}
