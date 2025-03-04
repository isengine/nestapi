import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsService } from '@src/clients/clients.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class ClientCredentialsGrant {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async clientCredentials(grantsTokenDto: GrantsTokenDto): Promise<any> {
    if (grantsTokenDto.grant_type !== 'client_credentials') {
      throw new BadRequestException(
        'Specified type of grant_type field is not supported in this request',
        'unsupported_grant_type',
      );
    }
    if (!grantsTokenDto.client_id || !grantsTokenDto.client_secret) {
      throw new BadRequestException(
        'Not specified client id or secret in this request',
        'invalid_grant',
      );
    }
    const { client_id, client_secret } = grantsTokenDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    });
    if (!client) {
      throw new BadRequestException(
        'Client authentication failed. Unknown client [client.client.credentials.grant]',
        'invalid_client',
      );
    }
    const token = await this.tokenService.pair({ client_id });
    if (!token) {
      throw new BadRequestException(
        'Client authentication failed. Unknown client [token.client.credentials.grant]',
        'invalid_client',
      );
    }
    return await this.tokenService.prepare(token, grantsTokenDto.state);
  }
}
