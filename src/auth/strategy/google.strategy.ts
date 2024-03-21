import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { UsersService } from '@src/users/users.service';
import { StrategiesService } from '@src/strategies/strategies.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly strategiesService: StrategiesService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CLIENT_CALLBACK'),
      scope: ['profile', 'email'],
    });
  }

  async validate(access_token: string, refresh_token: string, profile: Profile) {
    const account = profile._json;
    const auth = await this.authService.findByUsername(account.email);

    const authDto: AuthDto = {
      username: account.email,
      isActivated: !!account.email_verified,
    };

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(async (result) => await this.prepareResult(result, profile));
    }

    authDto.id = auth.id;
    return await this.authService
      .update(authDto)
      .then(async (result) => await this.prepareResult(result, profile));
  }

  async prepareResult(auth, profile): Promise<AuthDto> {
    const account = profile._json;
    await this.strategiesService.updateByAuthId({
      auth: { id: auth.id },
      name: profile.provider,
      uid: profile.id,
      json: JSON.stringify(account),
    });
    await this.userService.updateByAuthId({
      auth: { id: auth.id },
      email: account.email,
      name: account.given_name,
      lastName: account.family_name,
      avatar: account.picture,
      locale: account.locale,
    });
    return auth;
  }
}
