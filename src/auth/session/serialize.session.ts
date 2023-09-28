import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(auth: AuthEntity, done) {
    done(undefined, auth);
  }

  async deserializeUser(payload: any, done) {
    const auth = await this.authService.authGetOne(payload.id);
    return done(undefined, auth ?? undefined);
  }
}
