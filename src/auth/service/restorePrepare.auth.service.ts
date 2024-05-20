import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { ConfirmService } from '@src/confirm/confirm.service';
import { FindByUsernameAuthService } from '@src/auth/service/findByUsername.auth.service';

@Injectable()
export class RestorePrepareAuthService {
  constructor(
    protected readonly confirmService: ConfirmService,
    protected readonly findByUsernameAuthService: FindByUsernameAuthService,
  ) {}

  async restorePrepare(authDto: AuthDto): Promise<boolean> {
    const auth = await this.findByUsernameAuthService.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const confirm = await this.confirmService.confirmCreate(auth, 'restore');
    return !!confirm;
  }
}
