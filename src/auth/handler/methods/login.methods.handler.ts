import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class LoginMethodsHandler {
  constructor(
    protected readonly authService: AuthService,
  ) {}

  async login(authDto: AuthDto, request: any = null): Promise<AuthEntity> {
    const auth = await this.authService.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await compare(authDto.password, auth.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return auth;
  }
}
