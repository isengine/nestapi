import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthEntity } from '@src/auth/auth.entity';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate({ id }: Pick<AuthEntity, 'id'>) {
    const auth = await this.authService.findOne(id);
    console.log(' --- auth ', auth);
    if (!auth.id) {
      throw new ForbiddenException('You have no rights!');
    }
    return auth;
  }
}
