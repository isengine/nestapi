import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PairHandler } from '@src/token/handler/pair.handler';
import { VerifyHandler } from '@src/token/handler/verify.handler';

@Injectable()
export class RefreshHandler {
  constructor(
    private readonly pairHandler: PairHandler,
    private readonly verifyHandler: VerifyHandler,
  ) {}

  async refresh(refresh_token: string, callback = null): Promise<any> {
    if (!refresh_token) {
      throw new UnauthorizedException('Please sign in!');
    }

    const result = await this.verifyHandler.verify(refresh_token, 'refresh');

    if (callback) {
      const matched = callback(result);
      if (!matched) {
        throw new UnauthorizedException('Refresh token is not valid!');
      }
    }

    const data: any = {};

    if (result.client_id) {
      data.client_id = result.client_id;
    }

    if (result.id) {
      data.id = result.id;
    }

    return await this.pairHandler.pair(data);
  }
}
