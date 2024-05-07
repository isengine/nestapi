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
    const customAuthServer = 'http://localhost:5000';

    const clientID = '16992fb0-2b4e-4752-8325-a7bb81eec4d3';
    const clientSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiIxNjk5MmZiMC0yYjRlLTQ3NTItODMyNS1hN2JiODFlZWM0ZDMiLCJpYXQiOjE3MTQxNzMwNzZ9.6XBWyV3P2pv_uDF5SatMPc7k1v-7Mo68sjIRpVb1D3M';
    const redirect_uri = 'http://localhost:3000/auth/id1t/redirect';
    const authorizationURL = `${customAuthServer}/auth/?client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=code`;
    const tokenURL = `${customAuthServer}/token`;

    super({
      clientID,
      clientSecret,
      authorizationURL,
      tokenURL,
      callbackURL: redirect_uri,
      // scope: ['profile', 'email'],
    });
  }

  async validate(accessToken, refreshToken) {
    // откуда он берет accessToken и как он узнает его - ведь пользователь не введен
    // скорее всего он берет id учетки, на которую зарегаен клиент
    // нужно, чтобы сервер авторизации запрашивал токен у браузера пользователя
    // и если его нет, то чтобы давал форму входа
    const profile = await axios.get(
      'http://localhost:5000/users/self?relations=[{"name":"auth"}]',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).then(r => r.data);

    const auth = await this.authService.findByUsername(profile.auth.username);

    const authDto: AuthDto = {
      username: profile.auth.username,
      isActivated: !!profile.auth.isActivated,
    };

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(async (result) => await this.prepareResult(result, profile));
    }

    return await this.authService
      .update(auth.id, authDto)
      .then(async (result) => await this.prepareResult(result, profile));
  }

  async prepareResult(auth, profile): Promise<AuthDto> {
    await this.strategiesService.updateBy({
      auth: { id: auth.id },
      name: 'id1t',
      uid: profile.auth.id,
      json: JSON.stringify(profile),
    });
    const user = await this.userService.first(null, null, auth.id);
    await this.userService.update(
      user.id,
      {
        email: profile.username,
        name: profile.name,
        avatar: profile.avatar,
      },
      null,
      auth.id,
    );
    return auth;
  }
}
