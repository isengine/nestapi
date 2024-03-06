import { Injectable, BadRequestException } from '@nestjs/common';
import { TokensService } from '@src/tokens/tokens.service';
import { TokenClientsDto } from '@src/clients/dto/token.clients.dto';
import { AuthService } from '@src/auth/auth.service';
import { TokensDto } from '@src/tokens/tokens.dto';
import { ClientsService } from '@src/clients/service/clients.service';

@Injectable()
export class TokenClientsService {
  constructor(
    private readonly authService: AuthService,
    private readonly clientsService: ClientsService,
    private readonly tokensService: TokensService,
  ) {}

  async clientsTokenPrepare(tokens: TokensDto, state: any): Promise<any> {
    return {
      access_token: tokens?.access_token,
      token_type: 'Bearer',
      expires_in: tokens?.expires_in,
      refresh_token: tokens?.refresh_token,
      state,
    };   
  }

  async clientsTokenPassword(tokenClientsDto: TokenClientsDto): Promise<any> {
    if (tokenClientsDto.grant_type !== 'password') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'invalid_grant');
    }
    if (
      !tokenClientsDto.username
      || !tokenClientsDto.password
    ) {
      throw new BadRequestException('Not specified username or password in this request', 'invalid_request');
    }
    const { username, password } = tokenClientsDto;
    const login = await this.authService.login({ username, password });
    return await this.clientsTokenPrepare(login.tokens, tokenClientsDto.state);
  }

  async clientsTokenRefreshToken(tokenClientsDto: TokenClientsDto): Promise<any> {
    if (tokenClientsDto.grant_type !== 'refresh_token') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'invalid_grant');
    }
    if (
      !tokenClientsDto.refresh_token
      || !tokenClientsDto.client_id
      || !tokenClientsDto.client_secret
    ) {
      throw new BadRequestException('Not specified refresh token in this request', 'invalid_request');
    }
    const { refresh_token, client_id, client_secret } = tokenClientsDto;
    const auth = await this.tokensService.tokensVerify(refresh_token);
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
      auth: {
        id: auth.id,
      },
    });
    if (!client.length) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const tokens = await this.tokensService.tokensRefresh(refresh_token);
    return await this.clientsTokenPrepare(tokens, tokenClientsDto.state);
  }

  async clientsTokenClientCredentials(tokenClientsDto: TokenClientsDto): Promise<any> {
    if (tokenClientsDto.grant_type !== 'client_credentials') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'invalid_grant');
    }
    if (
      !tokenClientsDto.client_id
      || !tokenClientsDto.client_secret
    ) {
      throw new BadRequestException('Not specified client id or secret in this request', 'invalid_request');
    }
    const { client_id, client_secret } = tokenClientsDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    }, [{ name: 'auth' }]);
    if (!client?.[0]?.auth) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const tokens = await this.tokensService.tokensCreatePair(client[0].auth);
    if (!tokens) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.clientsTokenPrepare(tokens, tokenClientsDto.state);
  }

  async clientsTokenAuthorizationCode(tokenClientsDto: TokenClientsDto): Promise<any> {
    if (tokenClientsDto.grant_type !== 'authorization_code') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'invalid_grant');
    }
    if (
      !tokenClientsDto.code
      || !tokenClientsDto.redirect_uri
    ) {
      throw new BadRequestException('Not specified authorization code or redirect uri in this request', 'invalid_request');
    }
    const { code, redirect_uri } = tokenClientsDto;
    const client = await this.clientsService.clientsGetWhere({
      code,
      redirect_uri,
    }, [{ name: 'auth' }]);
    if (!client?.[0]?.auth) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    client[0].code = null
    await this.clientsService.clientsUpdate(client[0]);
    const tokens = await this.tokensService.tokensCreatePair(client[0].auth);
    if (!tokens) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.clientsTokenPrepare(tokens, tokenClientsDto.state);
  }
}
