import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthStrategiesService } from '@src/auth/auth_strategies/auth_strategies.service';
// import { OauthProvider } from '@src/auth/auth_strategies/provider/oauth.provider';

import axios from 'axios';
// import { Request } from 'express';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly authStrategiesService: AuthStrategiesService, // private readonly oauthProvider: OauthProvider,
  ) {
    const clientID = configService.get('OAUTH_CLIENT_ID');
    const clientSecret = configService.get('OAUTH_CLIENT_SECRET');
    const callbackURL = configService.get('OAUTH_CLIENT_REDIRECT');
    const customAuthServer = configService.get('OAUTH_SERVER');
    const authorizationURL = `${customAuthServer}/auth/?client_id=${clientID}&redirect_uri=${callbackURL}&response_type=code`;
    const tokenURL = `${customAuthServer}/token`;

    super({
      clientID,
      clientSecret,
      authorizationURL,
      tokenURL,
      callbackURL,
      // scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    const customAuthServer = this.configService.get('OAUTH_SERVER');

    const profile = await axios
      .get(`${customAuthServer}/auth/self`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((r) => r.data);

    const auth = await this.authService.findByUsername(profile.username);

    const authDto: AuthDto = {
      username: profile.username,
      isActivated: !!profile.isActivated,
    };

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(
          async (result) =>
            await this.prepareResult(
              result,
              profile.id,
              profile.users,
              accessToken,
              refreshToken,
            ),
        );
    }

    return await this.authService
      .update(auth.id, authDto)
      .then(
        async (result) =>
          await this.prepareResult(
            result,
            profile.id,
            profile.users,
            accessToken,
            refreshToken,
          ),
      );
  }

  async prepareResult(
    auth,
    uid,
    profile,
    accessToken,
    refreshToken,
  ): Promise<AuthDto> {
    await this.authStrategiesService.updateBy({
      auth: { id: auth.id },
      name: 'oauth',
      uid,
      json: profile,
      accessToken,
      refreshToken,
      // json: JSON.stringify(profile),
    });

    return auth;
  }
}
