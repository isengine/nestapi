import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    return token;
  }

  async tokensCreatePair(auth) {
    const data = { id: auth.id };
    const accessToken = await this.tokensGenerateOne(data, 'JWT_ACCESS_EXPIRES');
    const refreshToken = await this.tokensGenerateOne(data, 'JWT_REFRESH_EXPIRES');
    return { accessToken, refreshToken };
  }

  async tokensRefresh(tokensDto: TokensDto, request: any): Promise<TokensDto> {
    const { refreshToken } = tokensDto;
    const sessionToken = request.session.token;
    // console.log('-- request.session', request.session);
    if (!refreshToken || !sessionToken || refreshToken !== sessionToken) {
      throw new UnauthorizedException('Please sign in!');
    }
    let result;
    try {
      result = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    // const tokens = await this.tokensCreatePair(result.id, refreshToken);
    // раньше мы проверяли токен только в сессии
    // потом мы решили перенести токены в бд и проверять наличие токена в бд
    // но это плохая практика, т.к. токены не должны храниться в других местах
    // и мы снова оставили хранение токена в сессии
    // и теперь для оптимизации и безопасности будет работать с сессиями
    const tokens = await this.tokensCreatePair(result.id);
    request.session.token = tokens.refreshToken;
    return tokens;
  }
}
