import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { UsersService } from '@src/users/users.service';
import { responseServer } from '@src/common/service/response.service';
import { StrategiesService } from '@src/strategies/strategies.service';

@Injectable()
export class LeaderProvider {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly strategiesService: StrategiesService,
    private readonly userService: UsersService,
  ) {}

  async activate(request): Promise<any> {
    const token = request?.query?.code;

    if (!token) {
      return null;
    }

    const res = await this.getToken(token);
    const user = res.user_id ? await this.getUser(res.user_id, res.access_token) : undefined;
    return user;
  }
  
  async getToken(token: string): Promise<any> {
    return responseServer({
      url: 'https://apps.leader-id.ru/api/v1/oauth/token',
      method: 'post',
      data: {
        client_id: this.configService.get('LEADER_CLIENT_ID'),
        client_secret: this.configService.get('LEADER_CLIENT_SECRET'),
        grant_type: 'authorization_code',
        code: token,
      },
      headers: null,
    });
  }

  async getUser(userId: string, accessToken: string): Promise<any> {
    return responseServer({
      url: `https://apps.leader-id.ru/api/v1/users/${userId}`,
      method: 'get',
      data: null,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

    authDto.id = auth.id;
    return await this.authService
      .update(authDto)
      .then(async (result) => await this.prepareResult(result, account));
  }

  async prepareResult(auth, account): Promise<AuthDto> {
    const genders = {
      male: 'm',
      female: 'w',
    };
    const { postCode, country, region, city, street, house, building, wing, apartment, place } = account.address;
    const address = `${
        postCode ? `${postCode}, ` : ''
      }${
        country ? `${country}, ` : ''
      }${
        region ? `${region}, ` : ''
      }${
        city ? `${city}, ` : ''
      }${
        street ? `${street}, ` : ''
      }${
        house ? `${house}, ` : ''
      }${
        building ? `${building}, ` : ''
      }${
        wing ? `${wing}, ` : ''
      }${
        apartment ? `${apartment}, ` : ''
      }${
        place ? `${place}, ` : ''
      }`;
    await this.strategiesService.updateByAuthId({
      auth: { id: auth.id },
      name: 'leaderid',
      uid: account.id,
      json: JSON.stringify(account),
    });
    await this.userService.updateByAuthId({
      auth: { id: auth.id },
      email: account.email,
      phone: `7${account.phone}`,
      name: account.firstName,
      lastName: account.lastName,
      parentName: account.fatherName,
      avatar: account.photo,
      birthday: account.birthday,
      address,
      timezone: account.address?.timezone,
      gender: genders[account.gender] || '',
    });
    return auth;
  }
}
