import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { UsersService } from '@src/users/users.service';
import { StrategiesService } from '@src/strategies/strategies.service';

import axios from 'axios';

@Injectable()
export class Id1tStrategy extends PassportStrategy(Strategy, 'id1t') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly strategiesService: StrategiesService,
    private readonly userService: UsersService,
  ) {
    const clientID = configService.get('ID1T_CLIENT_ID');
    const clientSecret = configService.get('ID1T_CLIENT_SECRET');
    const callbackURL = configService.get('ID1T_CLIENT_CALLBACK');
    const customAuthServer = configService.get('ID1T_SERVER');
    const authorizationURL = `${customAuthServer}/auth/?client_id=${clientID}&redirect_uri=${callbackURL}&response_type=code`;
    const tokenURL = `${customAuthServer}/token`;

    console.log('-- id1t constructor...');
    console.log('-- clientID', clientID);
    console.log('-- clientSecret', clientSecret);
    console.log('-- callbackURL', callbackURL);
    console.log('-- customAuthServer', customAuthServer);
    console.log('-- authorizationURL', authorizationURL);
    console.log('-- tokenURL', tokenURL);
    console.log('-- ^^^');

    super({
      clientID,
      clientSecret,
      authorizationURL,
      tokenURL,
      callbackURL,
      // scope: ['profile', 'email'],
    });
  }

  async validate(accessToken, refreshToken) {
    // откуда он берет accessToken и как он узнает его - ведь пользователь не введен
    // скорее всего он берет id учетки, на которую зарегаен клиент
    // нужно, чтобы сервер авторизации запрашивал токен у браузера пользователя
    // и если его нет, то чтобы давал форму входа
    const customAuthServer = this.configService.get('ID1T_SERVER');

    console.log('-- id1t validate...');
    console.log('-- customAuthServer', customAuthServer);
    console.log('-- accessToken', accessToken);

    const profile = await axios.get(
      `${customAuthServer}/auth/self`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).then(r => r.data);

    console.log('-- profile', profile);
    console.log('-- ^^^');

    const auth = await this.authService.findByUsername(profile.username);

    const authDto: AuthDto = {
      username: profile.username,
      isActivated: !!profile.isActivated,
    };

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(async (result) => await this.prepareResult(result, profile.id, profile.users[0]));
    }

    return await this.authService
      .update(auth.id, authDto)
      .then(async (result) => await this.prepareResult(result, profile.id, profile.users[0]));
  }

  async prepareResult(auth, uid, profile): Promise<AuthDto> {
    await this.strategiesService.updateBy({
      auth: { id: auth.id },
      name: 'id1t',
      uid,
      json: profile,
      // json: JSON.stringify(profile),
    });
    const user = await this.userService.first(null, null, auth.id);
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
    return auth;
  }
}
