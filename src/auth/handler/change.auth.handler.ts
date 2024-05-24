import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class ChangeAuthHandler {
  constructor(
    protected readonly authService: AuthService,
    protected readonly authConfirmService: AuthConfirmService,
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
    const salt = await genSalt(10);
    const password = await hash(authDto.password, salt);
    await this.authService.update(auth.id, {
      password,
    });
    return !!confirm;
  }
}
