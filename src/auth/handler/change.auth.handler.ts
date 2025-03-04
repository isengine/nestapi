import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthConfirmService } from '@src/auth/auth_confirm/auth_confirm.service';
import { AuthService } from '@src/auth/auth.service';
import { HashAuthHandler } from '@src/auth/handler/hash.auth.handler';

@Injectable()
export class ChangeAuthHandler {
  constructor(
    protected readonly authService: AuthService,
    protected readonly authConfirmService: AuthConfirmService,
    protected readonly hashAuthHandler: HashAuthHandler,
  ) {}

  async change(authDto: AuthDto, code: string): Promise<boolean> {
    const confirm = await this.authConfirmService.validate(code, 'reset');
    if (!confirm) {
      throw new BadRequestException('Invalid reset code');
    }
    const { auth } = confirm;
    if (!auth || auth.username !== authDto.username) {
      throw new UnauthorizedException('User not found');
    }
    const password = await this.hashAuthHandler.generate(authDto.password);
    await this.authService.update(auth.id, {
      password,
    });
    return !!confirm;
  }
}
