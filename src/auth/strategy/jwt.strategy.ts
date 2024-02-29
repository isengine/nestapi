import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '@src/auth/auth.service';
import { AuthEntity } from '@src/auth/auth.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: !configService.get('JWT_EXPIRES'),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ id }: Pick<AuthEntity, 'id'>) {
    const auth = await this.authService.authGetOne(id);
    if (!auth.id) {
      throw new ForbiddenException('You have no rights!');
    }
    return auth;
  }
}
