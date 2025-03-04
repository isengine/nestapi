import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthService } from '@src/auth/auth.service';
import { AuthStrategiesService } from '@src/auth/auth_strategies/auth_strategies.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UntiProvider {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly strategiesService: AuthStrategiesService,
  ) {}

  async activate(request): Promise<any> {
    const token = request?.query?.code;

    if (!token) {
      return null;
    }

    const res = await this.getToken(token);
    const user = res.access_token
      ? await this.getUser(res.access_token)
      : undefined;
    return {
      ...user,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
    };
  }

  async getToken(token: string): Promise<any> {
    return axios
      .post(
        'https://sso.2035.university/oauth2/access_token',
        {
          grant_type: 'authorization_code',
          code: token,
          client_id: this.configService.get('UNTI_CLIENT_ID'),
          client_secret: this.configService.get('UNTI_CLIENT_SECRET'),
          redirect_uri: this.configService.get('UNTI_CLIENT_REDIRECT'),
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((r) => r.data)
      .catch((e) => {
        console.error(e);
      });
  }

  async getUser(accessToken: string): Promise<any> {
    return axios
      .get('https://sso.2035.university/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((r) => r.data)
      .catch((e) => {
        console.error(e);
      });
  }

  async validate(account) {
    const auth = await this.authService.findByUsername(account.email);

    const authDto: AuthDto = {
      username: account.email,
      isActivated: true,
    };

    if (!auth) {
      return await this.authService
        .create(authDto)
        .then(async (result) => await this.prepareResult(result, account));
    }

    return await this.authService
      .update(auth.id, authDto)
      .then(async (result) => await this.prepareResult(result, account));
  }

  async prepareResult(auth, account): Promise<AuthDto> {
    await this.strategiesService.updateBy({
      auth: { id: auth.id },
      name: 'unti',
      uid: account.unti_id,
      json: account,
      // json: JSON.stringify(account),
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    });

    return auth;
  }
}
