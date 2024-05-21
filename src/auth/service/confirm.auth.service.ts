import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthFilter } from '@src/auth/auth.filter';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class ConfirmAuthService extends CommonService<
  AuthEntity,
  AuthDto,
  AuthFilter
> {
  constructor(
    @InjectRepository(AuthEntity)
    protected readonly repository: Repository<AuthEntity>,
    protected readonly authConfirmService: AuthConfirmService,
  ) {
    super();
  }

  async confirm(code: string): Promise<boolean> {
    const confirm = await this.authConfirmService.validate(code);
    if (confirm) {
      const { auth } = confirm;
      await super.update(auth.id, {
        isActivated: true,
      });
    }
    return !!confirm;
  }
}
