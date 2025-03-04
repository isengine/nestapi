import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthStrategiesService } from '@src/auth/auth_strategies/auth_strategies.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly strategiesService: AuthStrategiesService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CLIENT_REDIRECT'),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const account = profile._json;
    const auth = await this.authService.findByUsername(account.email);

    const authDto: AuthDto = {
      username: account.email,
      isActivated: !!account.email_verified,
    };

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(
          async (result) =>
            await this.prepareResult(
              result,
              profile,
              accessToken,
              refreshToken,
            ),
        );
    }

    return await this.authService
      .update(auth.id, authDto)
      .then(
        async (result) =>
          await this.prepareResult(result, profile, accessToken, refreshToken),
      );
  }

  async prepareResult(
    auth,
    profile,
    accessToken,
    refreshToken,
  ): Promise<AuthDto> {
    const account = profile._json;
    await this.strategiesService.updateBy({
      auth: { id: auth.id },
      name: profile.provider,
      uid: profile.id,
      json: account,
      // json: JSON.stringify(account),
      accessToken,
      refreshToken,
    });

    return auth;
  }
}
