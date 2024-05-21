import { Injectable } from '@nestjs/common';
import { TokenGrantsDto } from '@src/token_grants/token_grants.dto';

import { AuthGrantsService } from '@src/token_grants/service/auth.token_grants.service';
import { AuthorizationCodeGrantsService } from '@src/token_grants/service/authorization_code.token_grants.service';
import { ClientCredentialsGrantsService } from '@src/token_grants/service/client_credentials.token_grants.service';
import { ClientGrantsService } from '@src/token_grants/service/client.token_grants.service';
import { PasswordGrantsService } from '@src/token_grants/service/password.token_grants.service';
import { PersonCredentialsGrantsService } from '@src/token_grants/service/person_credentials.token_grants.service';
import { RefreshTokenGrantsService } from '@src/token_grants/service/refresh_token.token_grants.service';

@Injectable()
export class TokenGrantsService {
  constructor(
    private readonly authGrantsService: AuthGrantsService,
    private readonly authorizationCodeGrantsService: AuthorizationCodeGrantsService,
    private readonly clientCredentialsGrantsService: ClientCredentialsGrantsService,
    private readonly clientGrantsService: ClientGrantsService,
    private readonly passwordGrantsService: PasswordGrantsService,
    private readonly personCredentialsGrantsService: PersonCredentialsGrantsService,
    private readonly refreshTokenGrantsService: RefreshTokenGrantsService,
  ) {}

  async auth(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    return await this.authGrantsService.auth(tokenGrantsDto);
  }

  async authorizationCode(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    return await this.authorizationCodeGrantsService.authorizationCode(tokenGrantsDto);
  }

  async client(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    return await this.clientGrantsService.client(tokenGrantsDto);
  }

  async clientCredentials(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    return await this.clientCredentialsGrantsService.clientCredentials(tokenGrantsDto);
  }

  async password(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    return await this.passwordGrantsService.password(tokenGrantsDto);
  }

  async personCredentials(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    return await this.personCredentialsGrantsService.personCredentials(tokenGrantsDto);
  }

  async refreshToken(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    return await this.refreshTokenGrantsService.refreshToken(tokenGrantsDto);
  }
}
