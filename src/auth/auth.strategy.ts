import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ForbiddenException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
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

  async validate({ id, type, key }) {
    if (!type || type !== 'access') {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    const auth = await this.authService.findOne({ id });
    if (!auth.id || (!auth.isActivated && !key)) {
      throw new ForbiddenException('You have no rights!');
    }
    return auth;
  }
}
