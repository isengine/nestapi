import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { UsersService } from '@src/users/users.service';
import { MixinDto } from '@src/auth/dto/mixin.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CLIENT_CALLBACK'),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const account = profile._json;
    const auth = await this.authService.authGetByUsername(account.email);

    const authDto: AuthDto = {
      username: account.email,
      passportStrategy: profile.provider,
      passportId: profile.id,
      isActivated: !!account.email_verified,
    };

    if (!auth) {
      return await this.authService
        .authCreate(authDto)
        .then(async (result) => await this.prepareResult(result, account));
    }

    authDto.id = auth.id;
    return await this.authService
      .authUpdate(authDto)
      .then(async (result) => await this.prepareResult(result, account));
  }

  async prepareResult(auth, account): Promise<MixinDto> {
    await this.userService.usersUpdateByAuthId({
      authId: auth.id,
      email: account.email,
      name: account.name,
      firstName: account.given_name,
      lastName: account.family_name,
      avatar: account.picture,
      locale: account.locale,
    });
    return auth;
  }
}
