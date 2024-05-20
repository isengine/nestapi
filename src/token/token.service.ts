import { Injectable } from '@nestjs/common';
import { TokenDto } from '@src/token/token.dto';
import { OneTokenService } from '@src/token/service/one.token.service';
import { PairTokenService } from '@src/token/service/pair.token.service';
import { PrepareTokenService } from '@src/token/service/prepare.token.service';
import { RefreshTokenService } from '@src/token/service/refresh.token.service';
import { VerifyTokenService } from '@src/token/service/verify.token.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly oneTokenService: OneTokenService,
    private readonly pairTokenService: PairTokenService,
    private readonly prepareTokenService: PrepareTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly verifyTokenService: VerifyTokenService,
  ) {}

  async one(data, configKey): Promise<any> {
    return await this.oneTokenService.one(data, configKey);
  }

  async pair(data): Promise<any> {
    return await this.pairTokenService.pair(data);
  }

  async prepare(token: TokenDto, state: any): Promise<any> {
    return await this.prepareTokenService.prepare(token, state);
  }
  
  async refresh(refresh_token: string, callback = null): Promise<any> {
    return await this.refreshTokenService.refresh(refresh_token, callback);
  }

  async verify(token: string, type: string): Promise<any> {
    return await this.verifyTokenService.verify(token, type);
  }
}
