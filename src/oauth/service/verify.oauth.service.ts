import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';
import { OAuthDto } from '@src/oauth/oauth.dto';
import { ClientsService } from '@src/clients/clients.service';

@Injectable()
export class VerifyOAuthService {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  async verify(
    oauthDto: OAuthDto,
  ): Promise<ClientsDto> {
    const { response_type } = oauthDto;
    if (['code', 'token'].indexOf(response_type) < 0) {
      throw new BadRequestException('Specified type of response_type field is not supported in this request', 'invalid_request');
    }
    const result = await this.clientsService.clientsGetWhere({
      client_id: oauthDto.client_id,
      redirects: {
        uri: oauthDto.redirect_uri,
      },
    }, [
      { name: 'oauth' },
      { name: 'redirects' },
    ]);
    if (!result || !result.redirects.length) {
      throw new BadRequestException('Client oauthentication failed. Unknown client', 'invalid_client');
    }
    return result;
  }
}
