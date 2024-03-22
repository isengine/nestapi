import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class LeaderStrategy extends PassportStrategy(Strategy, 'leader') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('LEADER_CLIENT_ID'),
      clientSecret: configService.get('LEADER_CLIENT_SECRET'),

      // http://localhost:3000/auth/leader/login
      // http://localhost:3000/auth/leader/redirect?code=3c99e78a-4790-4e14-b3f9-fe53bf2276a5
      authorizationURL: `https://leader-id.ru/apps/authorize?client_id=${configService.get('LEADER_CLIENT_ID')}&redirect_uri=${configService.get('LEADER_CLIENT_CALLBACK')}&response_type=code`,
      tokenURL: 'https://leader-id.ru/',
    });
  }
}
