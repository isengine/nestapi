import { Injectable } from '@nestjs/common';
import { AuthConfirmService } from '@src/auth/auth_confirm/auth_confirm.service';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class ConfirmAuthHandler {
  constructor(
    protected readonly authService: AuthService,
    protected readonly authConfirmService: AuthConfirmService,
  ) {}

  async confirm(code: string): Promise<boolean> {
    const confirm = await this.authConfirmService.validate(code);
    if (confirm) {
      const { auth } = confirm;
      await this.authService.update(auth.id, {
        isActivated: true,
      });
    }
    return !!confirm;
  }
}
