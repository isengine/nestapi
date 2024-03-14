import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthEntity } from '@src/auth/auth.entity';
import { Request } from 'express';

@Injectable()
export class FormStrategy extends PassportStrategy(Strategy, 'form') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        FormStrategy.extractJWT,
        // FormStrategy.extractJWTfromLS,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   ExtractJwt.fromBodyField('client_secret'),
      //   ExtractJwt.fromHeader('client_secret'),
      //   // ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: !configService.get('JWT_EXPIRES'),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractJWT(req: Request): string | null {
    console.log(' --- req.cookies ', req.cookies);
    return req.cookies?.jwt || null;
  }

  // private static extractJWTfromLS(): string | null {
  //   const ls = localStorage.getItem('jwt');
  //   console.log(' --- localStorage ', ls);
  //   return ls || null;
  // }

  async validate({ id }: Pick<AuthEntity, 'id'>) {
    const auth = await this.authService.findOne(id);
    console.log(' --- auth ', auth);
    if (!auth.id) {
      throw new ForbiddenException('You have no rights!');
    }
    return auth;
  }
}
