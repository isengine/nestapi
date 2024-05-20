import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class TokenAuthService {
  constructor(
    private readonly tokenService: TokenService,
  ) {}

  async token(
    clientsDto: ClientsDto,
    id: number,
    state: string,
  ): Promise<string> {
    const [{ uri }] = clientsDto.redirects;
    delete clientsDto.auth;
    delete clientsDto.redirects;
    const token = await this.tokenService.pair({ id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${uri}?token_type=Bearer&expires_in=${token.expires_in}${state ? `&state=${state}` : ''}#access_token=${token.access_token}`;
  }
}
