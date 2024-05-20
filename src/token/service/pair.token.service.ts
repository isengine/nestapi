import { Injectable } from '@nestjs/common';
import { OneTokenService } from '@src/token/service/one.token.service';

@Injectable()
export class PairTokenService {
  constructor(
    private readonly oneTokenService: OneTokenService,
  ) {}

  async pair(data): Promise<any> {
    const accessTokenData = await this.oneTokenService.one(
      {
        ...data,
        type: 'access'
      },
      'JWT_ACCESS_EXPIRES',
    );

    const refreshTokenData = await this.oneTokenService.one(
      {
        ...data,
        type: 'refresh'
      },
      'JWT_REFRESH_EXPIRES',
    );

    return {
      access_token: accessTokenData.token,
      expires_in: accessTokenData.expiresIn,
      refresh_token: refreshTokenData.token,
    };
  }
}
