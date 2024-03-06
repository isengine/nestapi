import { request } from 'https';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class LeaderProvider {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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
    return this.responseServer(
      '/api/v1/oauth/token',
      'POST',
      JSON.stringify({
        client_id: this.configService.get('LEADER_CLIENT_ID'),
        client_secret: this.configService.get('LEADER_CLIENT_SECRET'),
        grant_type: 'authorization_code',
        code: token,
      }),
    );
  }

  async getUser(userId: string, access_token: string): Promise<any> {
    return this.responseServer(
      `/api/v1/users/${userId}`,
      'GET',
      '',
      { Authorization: `Bearer ${access_token}` },
    );
  }

  async responseServer(
    path: string,
    method: string,
    data: string = '',
    headers: any = {}
  ): Promise<any> {
    const options = {
      hostname: 'apps.leader-id.ru',
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        ...headers,
      },
    };

    return new Promise((resolve, reject) => {
      const req = request(options, (res) => {
        let resData = '';
        res.on('data', (d) => {
          resData += d;
        });
        res.on('end', () => {
          resolve(JSON.parse(resData));
        });
      });
  
      req.on('error', (e) => {
        reject(new Error(`Failed to send data to server: ${e.message}`));
      });

      req.write(data);
      req.end();
    });
  }

  async validate(account) {
    const auth = await this.authService.authGetByUsername(account.email);

    const authDto: AuthDto = {
      username: account.email,
      passportStrategy: 'leaderid',
      passportId: account.id,
      isActivated: !!(account.emailConfirmed || account.phoneConfirmed),
    };

    if (!auth) {
      return await this.authService
        .authCreate(authDto)
        .then(async (result) => await this.prepareResult(result, account));
    }

    authDto.id = auth.id;
    return await this.authService
      .authUpdate(authDto)
      .then(async (result) => await this.prepareResult(result, account));
  }

  async prepareResult(auth, account): Promise<AuthDto> {
    const genders = {
      male: 'm',
      female: 'w',
    };
    await this.userService.usersUpdateByAuthId({
      authId: auth.id,
      email: account.email,
      phone: `7${account.phone}`,
      name: `${account.firstName} ${account.lastName}`,
      firstName: account.firstName,
      lastName: account.lastName,
      fatherName: account.fatherName,
      avatar: account.photo,
      birthday: account.birthday,
      country: account.address?.country,
      region: account.address?.region,
      city: account.address?.city,
      street: account.address?.street,
      house: account.address?.house,
      building: account.address?.building,
      wing: account.address?.wing,
      apartment: account.address?.apartment,
      place: account.address?.place,
      postCode: account.address?.postCode,
      timezone: account.address?.timezone,
      tz: `${(Number(account?.address?.tz?.minutes) || 0) * 60}`,
      gender: genders[account.gender] || '',
    });
    return auth;
  }
}
