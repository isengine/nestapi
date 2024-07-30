import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthService } from '@src/auth/auth.service';
import { AuthStrategiesService } from '@src/auth_strategies/auth_strategies.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class OauthProvider {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly strategiesService: AuthStrategiesService,
    private readonly userService: UsersService,
  ) {}

  async activate(request): Promise<any> {
    const code = request?.query?.code;

    if (!code) {
      return null;
    }

    const res = await this.getToken(code);
    const user = res.access_token ? await this.getUser(res.access_token, res.refresh_token) : undefined;
    return {
      ...user,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
    };
  }

  async getToken(code: string) {
    const customAuthServer = this.configService.get('OAUTH_SERVER');
    const redirect_uri = this.configService.get('OAUTH_CLIENT_CALLBACK');
    const client_id = this.configService.get('OAUTH_CLIENT_ID');

    return axios.post(
      `${customAuthServer}/token`,
      {
        grant_type: 'authorization_code',
        code,
        client_id,
        redirect_uri,
      },
    )
      .then(r => r.data)
      .catch(e => {
        console.error(e);
      });
  }

  async getUser(accessToken: string, refreshToken: string): Promise<any> {
    const customAuthServer = this.configService.get('OAUTH_SERVER');

    return axios.get(
      `${customAuthServer}/auth/self`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      .then(r => r.data)
      .catch(e => {
        console.error(e);
      });
  }

  async validate(account) {
    const auth = await this.authService.findByUsername(account.username);

    const authDto: AuthDto = {
      username: account.username,
      isActivated: !!account.isActivated,
    };

    const userData = account?.users?.[0];
    const { accessToken, refreshToken } = account;

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(async (result) => await this.prepareResult(result, userData, accessToken, refreshToken));
    }

    return await this.authService
      .update(auth.id, authDto)
      .then(async (result) => await this.prepareResult(result, userData, accessToken, refreshToken));
  }

  async prepareResult(auth, account, accessToken, refreshToken): Promise<AuthDto> {
    await this.strategiesService.updateBy({
      auth: { id: auth.id },
      name: 'oauthid',
      uid: account.id,
      json: JSON.stringify(account),
      accessToken,
      refreshToken,
    });
    const user = await this.userService.first(null, null, null, auth.id);
    await this.userService.update(
      user.id,
      account,
      null,
      auth.id,
    );
    return auth;
  }
}
