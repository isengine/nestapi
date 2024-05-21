import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { FindByUsernameAuthService } from '@src/auth/service/find_by_username.auth.service';

@Injectable()
export class RestorePrepareAuthService {
  constructor(
    protected readonly authConfirmService: AuthConfirmService,
    protected readonly findByUsernameAuthService: FindByUsernameAuthService,
  ) {}

  async restorePrepare(authDto: AuthDto): Promise<boolean> {
    const auth = await this.findByUsernameAuthService.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const confirm = await this.authConfirmService.create(auth, 'restore');
    return !!confirm;
  }
}
