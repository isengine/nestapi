import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsService } from '@src/clients/clients.service';
import { OAuthService } from '@src/oauth/oauth.service';
import { TokenGrantsDto } from '@src/token_grants/token_grants.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class AuthorizationCodeGrantsService {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async authorizationCode(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    if (tokenGrantsDto.grant_type !== 'authorization_code') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !tokenGrantsDto.code
      || !tokenGrantsDto.client_id
      || !tokenGrantsDto.redirect_uri
    ) {
      throw new BadRequestException('Not specified authorization code, client_id or redirect uri in this request', 'invalid_grant');
    }
    const { code, client_id, redirect_uri } = tokenGrantsDto;
    const id = await this.oauthService.codeVerify(code, {
      client_id,
      redirect_uri,
    })
    if (!id) {
      throw new BadRequestException('Specified authorization code is invalid', 'invalid_grant');
    }
    const client = await this.clientsService.clientsGetWhere({
      code,
      client_id,
      redirects: {
        uri: redirect_uri,
      },
    }, [
      { name: 'auth' },
      { name: 'redirects' },
    ]);
    if (!client?.auth) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    client.code = null
    await this.clientsService.update(client.id, { ...client }, null, client.auth.id);

    // здесь токен для учетки
    // const token = await this.pairTokenService.pair({ id: client.auth.id });
    // либо должен быть токен для клиента, либо редирект на авторизацию пользователя
    const token = await this.tokenService.pair({ id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.tokenService.prepare(token, tokenGrantsDto.state);
  }
}
