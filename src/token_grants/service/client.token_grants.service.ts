import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsService } from '@src/clients/clients.service';
import { TokenGrantsDto } from '@src/token_grants/token_grants.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class ClientGrantsService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async client(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    const { refresh_token, client_id, client_secret } = tokenGrantsDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    });
    if (!client || !client_id || !client_secret) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const token = await this.tokenService.refresh(
      refresh_token,
      (data) => data.client_id === client_id,
    );
    return await this.tokenService.prepare(token, tokenGrantsDto.state);
  }
}
