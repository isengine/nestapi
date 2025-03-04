import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class UntiStrategy extends PassportStrategy(Strategy, 'unti') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('UNTI_CLIENT_ID'),
      clientSecret: configService.get('UNTI_CLIENT_SECRET'),
      callbackURL: configService.get('UNTI_CLIENT_REDIRECT'),

      authorizationURL: `https://sso.2035.university/oauth2/authorize?client_id=${configService.get(
        'UNTI_CLIENT_ID',
      )}&redirect_uri=${configService.get(
        'UNTI_CLIENT_REDIRECT',
      )}&response_type=code`,
      tokenURL: 'https://sso.2035.university/oauth2/access_token',
    });
  }
}
