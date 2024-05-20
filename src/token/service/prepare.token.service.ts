import { Injectable } from '@nestjs/common';
import { TokenDto } from '@src/token/token.dto';

@Injectable()
export class PrepareTokenService {
  constructor(
  ) {}

  async prepare(token: TokenDto, state: any): Promise<any> {
    const {
      access_token = undefined,
      expires_in = undefined,
      refresh_token = undefined,
    } = token;

    return {
      access_token,
      token_type: 'Bearer',
      expires_in,
      refresh_token,
      state,
    };
  }
}
