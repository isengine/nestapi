import { Injectable, BadRequestException } from '@nestjs/common';
import { TokenService } from '@src/token/token.service';
import { GrantsTokenDto } from '@src/token/dto/grants.dto';
import { AuthService } from '@src/auth/auth.service';
import { TokenDto } from '@src/token/token.dto';
import { ClientsService } from '@src/clients/clients.service';
import { OAuthService } from '@src/auth/service/oauth.service';
import { PersonsService } from '@src/persons/persons.service';

@Injectable()
export class GrantsTokenService {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
    private readonly clientsService: ClientsService,
    private readonly personsService: PersonsService,
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
    console.log('-- grantsTokenPassword', grantsTokenDto);
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
    const auth = await this.authService.login({ username, password });
    const token = await this.tokenService.tokenCreatePair({ id: auth.id });
    if (!token) {
      throw new BadRequestException('User authentication failed. Unknown user', 'invalid_user');
    }
    // if (request) {
    //   await this.sessionsService.createSession(auth, token, request);
    // }
    console.log('-- auth', auth);
    return await this.grantsTokenPrepare(token, grantsTokenDto.state);
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
    console.log('-- grantsTokenAuth', grantsTokenDto);
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

  async grantsTokenPersonCredentials(grantsTokenDto: GrantsTokenDto): Promise<any> {
    if (grantsTokenDto.grant_type !== 'person_credentials') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsTokenDto.username
      || !grantsTokenDto.password
    ) {
      throw new BadRequestException('Not specified username or password in this request', 'invalid_grant');
    }
    const { username, password } = grantsTokenDto;
    const person = await this.personsService.login({ username, password });
    const token = await this.tokenService.tokenCreatePair({ person_id: person.id });
    if (!token) {
      throw new BadRequestException('Person authentication failed. Unknown person', 'invalid_person');
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
    const id = await this.oauthService.oauthCodeVerify(code, {
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
    // const token = await this.tokenService.tokenCreatePair({ id: client.auth.id });
    // либо должен быть токен для клиента, либо редирект на авторизацию пользователя
    const token = await this.tokenService.tokenCreatePair({ id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return await this.grantsTokenPrepare(token, grantsTokenDto.state);
  }
}
