import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { UsersService } from '@src/users/users.service';
import { AuthStrategiesService } from '@src/auth_strategies/auth_strategies.service';
// import { OauthProvider } from '@src/auth_strategies/provider/oauth.provider';

import axios from 'axios';
// import { Request } from 'express';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly authStrategiesService: AuthStrategiesService,
    private readonly userService: UsersService,
    // private readonly oauthProvider: OauthProvider,
  ) {
    // console.log('-- oauth/login');

    const clientID = configService.get('OAUTH_CLIENT_ID');
    const clientSecret = configService.get('OAUTH_CLIENT_SECRET');
    const callbackURL = configService.get('OAUTH_CLIENT_CALLBACK');
    const customAuthServer = configService.get('OAUTH_SERVER');
    const authorizationURL = `${customAuthServer}/auth/?client_id=${clientID}&redirect_uri=${callbackURL}&response_type=code`;
    const tokenURL = `${customAuthServer}/token`;

    // console.log('-- oauth constructor...');
    // console.log('-- clientID', clientID);
    // console.log('-- clientSecret', clientSecret);
    // console.log('-- callbackURL', callbackURL);
    // console.log('-- customAuthServer', customAuthServer);
    // console.log('-- authorizationURL', authorizationURL);
    // console.log('-- tokenURL', tokenURL);
    // console.log('-- ^^^');

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
    // откуда он берет accessToken и как он узнает его - ведь пользователь не введен
    // скорее всего он берет id учетки, на которую зарегаен клиент
    // нужно, чтобы сервер авторизации запрашивал токен у браузера пользователя
    // и если его нет, то чтобы давал форму входа
    const customAuthServer = this.configService.get('OAUTH_SERVER');

    // console.log('-- oauth validate...');
    // console.log('-- customAuthServer', customAuthServer);
    // console.log('-- accessToken', accessToken);
    // console.log('-- refreshToken', refreshToken);

    const profile = await axios.get(
      `${customAuthServer}/auth/self`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).then(r => r.data);

    // console.log('-- profile', profile);
    // console.log('-- ^^^');

    const auth = await this.authService.findByUsername(profile.username);

    const authDto: AuthDto = {
      username: profile.username,
      isActivated: !!profile.isActivated,
    };

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(async (result) => await this.prepareResult(result, profile.id, profile.users, accessToken, refreshToken));
    }

    return await this.authService
      .update(auth.id, authDto)
      .then(async (result) => await this.prepareResult(result, profile.id, profile.users, accessToken, refreshToken));
  }

  async prepareResult(auth, uid, profile, accessToken, refreshToken): Promise<AuthDto> {
    await this.authStrategiesService.updateBy({
      auth: { id: auth.id },
      name: 'oauth',
      uid,
      json: profile,
      accessToken,
      refreshToken,
      // json: JSON.stringify(profile),
    });

    const user = await this.userService.first(null, null, null, auth.id);
    await this.userService.update(
      user.id,
      {
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
      },
      null,
      auth.id,
    );
    // console.log('-- auth', auth);
    // console.log('-- user', user);
    // console.log('-- profile', profile);

    return auth;
  }

  // async authenticate(req: Request, options?: any) {
  //   if (!req.query?.code) {
  //     return super.authenticate(req, options);
  //   }
  //   return await this.provider(req);
  // }

  // async provider(req: Request) {
  //   const account = await this.oauthProvider.activate(req);
  //   if (!account) {
  //     return;
  //   }
  //   return await this.oauthProvider.validate(account);
  // }
}
