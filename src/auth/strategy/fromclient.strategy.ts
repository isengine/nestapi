import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { responseServer } from '@src/common/service/response.service';

@Injectable()
export class FromClientStrategy extends PassportStrategy(Strategy, 'fromclient') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super(
      async (request, done) => {
        const user = await this.validate(request);
        done(null, user);
      },
    );
  }

  async validate(request: Request) {
    // const authorization = request.headers?.['authorization']?.replace(/.*?bearer\s*/ui, '');
    const authorization = request.headers?.['authorization'];

    const client_secret = request.body?.['client_secret'] || request.headers?.['client_secret'];
    console.log('--- client_secret', client_secret);
    if (!client_secret || !authorization) {
      throw new ForbiddenException('You have no rights!');
    }

    const options = {
      url: 'http://localhost:3000/auth/self',
      // url: this.configService.get('AUTHORIZATION_SERVER'),
      method: 'post',
      data: {
        // client_secret,
      },
      headers: {
        client_secret,
        authorization,
      },
    };
    console.log('-- options', options);

    const res = await responseServer(options);
    console.log('--res', res);
    // return await this.clientsService.clientsVerify(client_id, client_secret);

    return {};
  }
}
