import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenAuthService } from '@src/auth/service/open.auth.service';
import { ClientsService } from '@src/clients/clients.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class AuthorizationCodeGrant {
  constructor(
    private readonly openAuthService: OpenAuthService,
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async authorizationCode(grantsTokenDto: GrantsTokenDto): Promise<any> {
    if (grantsTokenDto.grant_type !== 'authorization_code') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsTokenDto.code
      || !grantsTokenDto.client_id
      || !grantsTokenDto.redirect_uri
    ) {
      throw new BadRequestException('Not specified authorization code, client_id or redirect uri in this request', 'invalid_grant');
    }
    const { code, client_id, redirect_uri } = grantsTokenDto;
    const id = await this.openAuthService.codeVerify(code, {
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
    return await this.tokenService.prepare(token, grantsTokenDto.state);
  }
}
