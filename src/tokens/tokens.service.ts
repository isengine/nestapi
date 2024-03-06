import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from '@src/tokens/tokens.dto';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async tokensGenerateOne(data, configKey) {
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

  async tokensCreatePair(auth) {
    const data = { id: auth.id };
    const accessTokenData = await this.tokensGenerateOne(data, 'JWT_ACCESS_EXPIRES');
    const refreshTokenData = await this.tokensGenerateOne(data, 'JWT_REFRESH_EXPIRES');
    return {
      access_token: accessTokenData.token,
      expires_in: accessTokenData.expiresIn,
      refresh_token: refreshTokenData.token,
    };
  }

  async tokensVerify(token: string): Promise<any> {
    let result;
    try {
      result = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    return result;
  }

  async tokensRefresh(refresh_token: string, request: any = null): Promise<TokensDto> {
    console.log('-- refresh_token', refresh_token);
    console.log('-- request.session', request?.session);
    if (!refresh_token) {
      throw new UnauthorizedException('Please sign in!');
    }
    if (request) {
      const sessionToken = request.session.token;
      if (!sessionToken || refresh_token !== sessionToken) {
        throw new UnauthorizedException('Please sign in!');
      }
    }
    const result = await this.tokensVerify(refresh_token);
    const tokens = await this.tokensCreatePair(result.id);
    if (request) {
      request.session.token = tokens.refresh_token;
    }
    return tokens;
  }
}
