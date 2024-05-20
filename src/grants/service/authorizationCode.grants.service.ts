import { Injectable, BadRequestException } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { ClientsService } from '@src/clients/clients.service';
import { AuthService } from '@src/auth/auth.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class AuthorizationCodeGrantsService {
  constructor(
    private readonly authService: AuthService,
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async authorizationCode(grantsDto: GrantsDto): Promise<any> {
    if (grantsDto.grant_type !== 'authorization_code') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsDto.code
      || !grantsDto.client_id
      || !grantsDto.redirect_uri
    ) {
      throw new BadRequestException('Not specified authorization code, client_id or redirect uri in this request', 'invalid_grant');
    }
    const { code, client_id, redirect_uri } = grantsDto;
    const id = await this.authService.codeVerify(code, {
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
    return await this.tokenService.prepare(token, grantsDto.state);
  }
}