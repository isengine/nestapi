import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsService } from '@src/clients/clients.service';

@Injectable()
export class ClientsStrategy extends PassportStrategy(Strategy, 'clients') {
  constructor(
    private readonly configService: ConfigService,
    private readonly clientsService: ClientsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromBodyField('client_secret'),
        ExtractJwt.fromHeader('client_secret'),
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: !configService.get('JWT_EXPIRES'),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    { client_id }: Pick<ClientsEntity, 'client_id'>,
  ) {
    // const authorization = request.body?.['client_secret'] || request.headers?.['client_secret'] || request.headers?.['authorization'];
    // const client_secret = authorization?.replace(/.*?bearer\s*/ui, '');
    const client_secret =
      request.body?.['client_secret'] || request.headers?.['client_secret'];
    if (!client_id || !client_secret) {
      throw new ForbiddenException('You have no rights!');
    }
    return await this.clientsService.clientsVerify(client_id, client_secret);
  }
}
