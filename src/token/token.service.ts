import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '@src/token/token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async tokenGenerateOne(data, configKey) {
    const expires = this.configService.get(configKey) || '';
    const token = await this.jwtService.signAsync(
      data,
      expires
        ? { expiresIn: expires }
        : {},
    );

    const date = {};
    expires?.match(/\d+[A-Za-z]*/igu)?.forEach(i => {
      const match = [
        i?.match(/\d+/igu)?.[0],
        i?.match(/[A-Za-z]+/igu)?.[0],
      ];
      date[match[1] || 's'] = Number(match[0]) || 0;
    });
    const expiresIn = moment.duration(date).asSeconds();

    return { token, expiresIn };
  }

  async tokenCreatePair(data) {
    const accessTokenData = await this.tokenGenerateOne({ ...data, type: 'access' }, 'JWT_ACCESS_EXPIRES');
    const refreshTokenData = await this.tokenGenerateOne({ ...data, type: 'refresh' }, 'JWT_REFRESH_EXPIRES');
    return {
      access_token: accessTokenData.token,
      expires_in: accessTokenData.expiresIn,
      refresh_token: refreshTokenData.token,
    };
  }

  async tokenVerify(token: string, type: string): Promise<any> {
    let result;
    try {
      result = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    if (!result || !result.type || result.type !== type) {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    return result;
  }

  async tokenRefresh(refresh_token: string, callback = null): Promise<any> {
    console.log('-- refresh_token', refresh_token);
    if (!refresh_token) {
      throw new UnauthorizedException('Please sign in!');
    }
    const result = await this.tokenVerify(refresh_token, 'refresh');
    console.log('-- tokenVerify', result);
    if (callback) {
      const matched = callback(result);
      if (!matched) {
        throw new UnauthorizedException('Refresh token is not valid!');
      }
    }
    const token = await this.tokenCreatePair(
      result.client_id
        ? { client_id: result.client_id }
        : { id: result.id }
    );
    return token;
  }
}
