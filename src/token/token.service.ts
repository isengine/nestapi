import { Injectable } from '@nestjs/common';
import { TokenDto } from '@src/token/token.dto';

import { OneHandler } from '@src/token/handler/one.handler';
import { PairHandler } from '@src/token/handler/pair.handler';
import { PrepareHandler } from '@src/token/handler/prepare.handler';
import { RefreshHandler } from '@src/token/handler/refresh.handler';
import { VerifyHandler } from '@src/token/handler/verify.handler';

@Injectable()
export class TokenService {
  constructor(
    private readonly oneHandler: OneHandler,
    private readonly pairHandler: PairHandler,
    private readonly prepareHandler: PrepareHandler,
    private readonly refreshHandler: RefreshHandler,
    private readonly verifyHandler: VerifyHandler,
  ) {}

  async one(data, configKey): Promise<any> {
    return await this.oneHandler.one(data, configKey);
  }

  async pair(data): Promise<any> {
    return await this.pairHandler.pair(data);
  }

  async prepare(token: TokenDto, state: any): Promise<any> {
    return await this.prepareHandler.prepare(token, state);
  }

  async refresh(refresh_token: string, callback = null): Promise<any> {
    return await this.refreshHandler.refresh(refresh_token, callback);
  }

  async verify(token: string, type: string): Promise<any> {
    return await this.verifyHandler.verify(token, type);
  }
}
