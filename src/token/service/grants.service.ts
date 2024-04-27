import { Injectable, BadRequestException } from '@nestjs/common';
import { TokenService } from '@src/token/token.service';
import { GrantsTokenDto } from '@src/token/dto/grants.dto';
import { AuthService } from '@src/auth/auth.service';
import { TokenDto } from '@src/token/token.dto';
import { ClientsService } from '@src/clients/clients.service';
import { OAuthService } from '@src/auth/service/oauth.service';

@Injectable()
export class GrantsTokenService {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async grantsTokenPrepare(token: TokenDto, state: any): Promise<any> {
    return {
      access_token: token?.access_token,
      token_type: 'Bearer',
      expires_in: token?.expires_in,
      refresh_token: token?.refresh_token,
      state,
    };
  }

  async grantsTokenPassword(grantsTokenDto: GrantsTokenDto): Promise<any> {
    if (grantsTokenDto.grant_type !== 'password') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsTokenDto.username
      || !grantsTokenDto.password
    ) {
      throw new BadRequestException('Not specified username or password in this request', 'invalid_grant');
    }
    const { username, password } = grantsTokenDto;
    const login = await this.authService.login({ username, password });
    return await this.grantsTokenPrepare(login.token, grantsTokenDto.state);
  }

  async grantsTokenRefreshToken(grantsTokenDto: GrantsTokenDto): Promise<any> {
    if (grantsTokenDto.grant_type !== 'refresh_token') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (!grantsTokenDto.refresh_token) {
      throw new BadRequestException('Not specified refresh token in this request', 'invalid_grant');
    }
    if (grantsTokenDto.client_id || grantsTokenDto.client_secret) {
      return await this.grantsTokenClient(grantsTokenDto);
    }
    return await this.grantsTokenAuth(grantsTokenDto);
  }

  async grantsTokenAuth(grantsTokenDto: GrantsTokenDto): Promise<any> {
    const { refresh_token } = grantsTokenDto;
    const token = await this.tokenService.tokenRefresh(
      refresh_token,
      (data) => !data.client_id,
    );
    // console.log('-- request.session', request?.session);
    // if (request) {
    //   const sessionToken = request.session.token;
    //   if (!sessionToken || refresh_token !== sessionToken) {
    //     throw new UnauthorizedException('Please sign in!');
    //   }
    //   request.session.token = token;
    // }
    return await this.grantsTokenPrepare(token, grantsTokenDto.state);
  }

  async grantsTokenClient(grantsTokenDto: GrantsTokenDto): Promise<any> {
    const { refresh_token, client_id, client_secret } = grantsTokenDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    });
    if (!client || !client_id || !client_secret) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const token = await this.tokenService.tokenRefresh(
      refresh_token,
      (data) => data.client_id === client_id,
    );
    return await this.grantsTokenPrepare(token, grantsTokenDto.state);
  }

  async grantsTokenClientCredentials(grantsTokenDto: GrantsTokenDto): Promise<any> {
    if (grantsTokenDto.grant_type !== 'client_credentials') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsTokenDto.client_id
      || !grantsTokenDto.client_secret
    ) {
      throw new BadRequestException('Not specified client id or secret in this request', 'invalid_grant');
    }
    const { client_id, client_secret } = grantsTokenDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    });
    if (!client) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const token = await this.tokenService.tokenCreatePair({ client_id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.grantsTokenPrepare(token, grantsTokenDto.state);
  }

  async grantsTokenAuthorizationCode(grantsTokenDto: GrantsTokenDto): Promise<any> {
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
    const codeMatched = this.oauthService.oauthCodeVerify(code, {
      client_id,
      redirect_uri,
    })
    if (!codeMatched) {
      throw new BadRequestException('Specified authorization code is invalid', 'invalid_grant');
    }
    const client = await this.clientsService.clientsGetWhere({
      code,
      client_id,
      redirect_uri,
    }, [{ name: 'auth' }]);
    if (!client?.auth) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    client.code = null
    await this.clientsService.update(client.id, { ...client }, null, client.auth.id);
    const token = await this.tokenService.tokenCreatePair({ id: client.auth.id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.grantsTokenPrepare(token, grantsTokenDto.state);
  }
}
