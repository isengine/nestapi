import { Injectable, BadRequestException } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { ClientsService } from '@src/clients/clients.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class ClientCredentialsGrantsService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async clientCredentials(grantsDto: GrantsDto): Promise<any> {
    if (grantsDto.grant_type !== 'client_credentials') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsDto.client_id
      || !grantsDto.client_secret
    ) {
      throw new BadRequestException('Not specified client id or secret in this request', 'invalid_grant');
    }
    const { client_id, client_secret } = grantsDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    });
    if (!client) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const token = await this.tokenService.pair({ client_id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.tokenService.prepare(token, grantsDto.state);
  }
}
