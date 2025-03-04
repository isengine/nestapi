import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthService } from '@src/auth/auth.service';
import { AuthStrategiesService } from '@src/auth/auth_strategies/auth_strategies.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LeaderProvider {
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
    const user = res.user_id
      ? await this.getUser(res.user_id, res.access_token)
      : undefined;
    return {
      ...user,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
    };
  }

  async getToken(token: string): Promise<any> {
    return axios
      .post('https://apps.leader-id.ru/api/v1/oauth/token', {
        grant_type: 'authorization_code',
        code: token,
        client_id: this.configService.get('LEADER_CLIENT_ID'),
        client_secret: this.configService.get('LEADER_CLIENT_SECRET'),
      })
      .then((r) => r.data)
      .catch((e) => {
        console.error(e);
      });
  }

  async getUser(userId: string, accessToken: string): Promise<any> {
    return axios
      .get(`https://apps.leader-id.ru/api/v1/users/${userId}`, {
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
      isActivated: !!(account.emailConfirmed || account.phoneConfirmed),
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
      name: 'leaderid',
      uid: account.id,
      json: account,
      // json: JSON.stringify(account),
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    });
    return auth;
  }
}
