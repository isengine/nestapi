import { Injectable } from '@nestjs/common';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';

import { AuthorizationCodeGrant } from '@src/token/grant/authorization_code.grant';
import { ClientCredentialsGrant } from '@src/token/grant/client_credentials.grant';
import { PasswordGrant } from '@src/token/grant/password.grant';
import { PersonCredentialsGrant } from '@src/token/grant/person_credentials.grant';
import { RefreshTokenGrant } from '@src/token/grant/refresh_token.grant';

@Injectable()
export class GrantsTokenService {
  constructor(
    private readonly authorizationCodeGrant: AuthorizationCodeGrant,
    private readonly clientCredentialsGrant: ClientCredentialsGrant,
    private readonly passwordGrant: PasswordGrant,
    private readonly personCredentialsGrant: PersonCredentialsGrant,
    private readonly refreshTokenGrant: RefreshTokenGrant,
  ) {}

  async authorizationCode(grantsTokenDto: GrantsTokenDto): Promise<any> {
    return await this.authorizationCodeGrant.authorizationCode(grantsTokenDto);
  }

  async clientCredentials(grantsTokenDto: GrantsTokenDto): Promise<any> {
    return await this.clientCredentialsGrant.clientCredentials(grantsTokenDto);
  }

  async password(grantsTokenDto: GrantsTokenDto, request, response): Promise<any> {
    return await this.passwordGrant.password(grantsTokenDto, request, response);
  }

  async personCredentials(grantsTokenDto: GrantsTokenDto): Promise<any> {
    return await this.personCredentialsGrant.personCredentials(grantsTokenDto);
  }

  async refreshToken(grantsTokenDto: GrantsTokenDto): Promise<any> {
    return await this.refreshTokenGrant.refreshToken(grantsTokenDto);
  }
}
