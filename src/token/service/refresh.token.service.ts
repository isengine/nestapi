import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PairTokenService } from '@src/token/service/pair.token.service';
import { VerifyTokenService } from '@src/token/service/verify.token.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly pairTokenService: PairTokenService,
    private readonly verifyTokenService: VerifyTokenService,
  ) {}

  async refresh(refresh_token: string, callback = null): Promise<any> {
    console.log('-- refresh_token', refresh_token);

    if (!refresh_token) {
      throw new UnauthorizedException('Please sign in!');
    }

    const result = await this.verifyTokenService.verify(refresh_token, 'refresh');

    console.log('-- verify', result);

    if (callback) {
      const matched = callback(result);
      console.log('-- callback matched', matched);
      if (!matched) {
        throw new UnauthorizedException('Refresh token is not valid!');
      }
    }

    const data: any = {};

    if (result.client_id) {
      data.client_id = result.client_id;
    }

    if (result.person_id) {
      data.person_id = result.person_id;
    }

    if (result.id) {
      data.id = result.id;
    }

    return await this.pairTokenService.pair(data);
  }
}
