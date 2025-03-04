import { Injectable } from '@nestjs/common';
import { OneHandler } from '@src/token/handler/one.handler';

@Injectable()
export class PairHandler {
  constructor(private readonly oneHandler: OneHandler) {}

  async pair(data): Promise<any> {
    const accessTokenData = await this.oneHandler.one(
      {
        ...data,
        type: 'access',
      },
      'JWT_ACCESS_EXPIRES',
    );

    const refreshTokenData = await this.oneHandler.one(
      {
        ...data,
        type: 'refresh',
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
