import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { FindByUsernameAuthService } from '@src/auth/service/findByUsername.auth.service';

@Injectable()
export class LoginAuthService {
  constructor(
    protected readonly findByUsernameAuthService: FindByUsernameAuthService,
  ) {}

  async login(authDto: AuthDto, request: any = null): Promise<AuthEntity> {
    const auth = await this.findByUsernameAuthService.findByUsername(authDto.username);
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
