import { Injectable, BadRequestException } from '@nestjs/common';
import { TokensService } from '@src/tokens/tokens.service';
import { TokensGrantsDto } from '@src/tokens/dto/tokens.grants.dto';
import { AuthService } from '@src/auth/auth.service';
import { TokensDto } from '@src/tokens/tokens.dto';
import { ClientsService } from '@src/clients/clients.service';
import { AuthOauthService } from '@src/auth/service/auth.oauth.service';

@Injectable()
export class TokensGrantsService {
  constructor(
    private readonly authService: AuthService,
    private readonly authOauthService: AuthOauthService,
    private readonly clientsService: ClientsService,
    private readonly tokensService: TokensService,
  ) {}

  async tokensGrantsPrepare(tokens: TokensDto, state: any): Promise<any> {
    return {
      access_token: tokens?.access_token,
      token_type: 'Bearer',
      expires_in: tokens?.expires_in,
      refresh_token: tokens?.refresh_token,
      state,
    };
  }

  async tokensGrantsPassword(tokensGrantsDto: TokensGrantsDto): Promise<any> {
    if (tokensGrantsDto.grant_type !== 'password') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !tokensGrantsDto.username
      || !tokensGrantsDto.password
    ) {
      throw new BadRequestException('Not specified username or password in this request', 'invalid_grant');
    }
    const { username, password } = tokensGrantsDto;
    const login = await this.authService.login({ username, password });
    return await this.tokensGrantsPrepare(login.tokens, tokensGrantsDto.state);
  }

  async tokensGrantsRefreshToken(tokensGrantsDto: TokensGrantsDto): Promise<any> {
    if (tokensGrantsDto.grant_type !== 'refresh_token') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (!tokensGrantsDto.refresh_token) {
      throw new BadRequestException('Not specified refresh token in this request', 'invalid_grant');
    }
    const { refresh_token } = tokensGrantsDto;
    const tokens = await this.tokensService.tokensRefresh(refresh_token);
    return await this.tokensGrantsPrepare(tokens, tokensGrantsDto.state);
  }

  async tokensGrantsClientCredentials(tokensGrantsDto: TokensGrantsDto): Promise<any> {
    if (tokensGrantsDto.grant_type !== 'client_credentials') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !tokensGrantsDto.client_id
      || !tokensGrantsDto.client_secret
    ) {
      throw new BadRequestException('Not specified client id or secret in this request', 'invalid_grant');
    }
    const { client_id, client_secret } = tokensGrantsDto;
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
    return await this.tokensGrantsPrepare(tokens, tokensGrantsDto.state);
  }

  async tokensGrantsAuthorizationCode(tokensGrantsDto: TokensGrantsDto): Promise<any> {
    if (tokensGrantsDto.grant_type !== 'authorization_code') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !tokensGrantsDto.code
      || !tokensGrantsDto.client_id
      || !tokensGrantsDto.redirect_uri
    ) {
      throw new BadRequestException('Not specified authorization code, client_id or redirect uri in this request', 'invalid_grant');
    }
    const { code, client_id, redirect_uri } = tokensGrantsDto;
    const codeMatched = this.authOauthService.oauthCodeVerify(code, {
      client_id,
      redirect_uri,
    })
    if (!codeMatched) {
      throw new BadRequestException('Specified authorization code is invalid', 'invalid_grant');
    }
    const result = await this.clientsService.clientsGetWhere({
      code,
      client_id,
      redirect_uri,
    }, [{ name: 'auth' }]);
    const client = result?.[0];
    if (!client?.auth) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    client.code = null
    await this.clientsService.update(client.id, { ...client });
    const tokens = await this.tokensService.tokensCreatePair(client.auth);
    if (!tokens) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.tokensGrantsPrepare(tokens, tokensGrantsDto.state);
  }
}
