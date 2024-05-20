import { Injectable } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { AuthGrantsService } from '@src/grants/service/auth.grants.service';
import { AuthorizationCodeGrantsService } from '@src/grants/service/authorizationCode.grants.service';
import { ClientCredentialsGrantsService } from '@src/grants/service/clientCredentials.grants.service';
import { ClientGrantsService } from '@src/grants/service/client.grants.service';
import { PasswordGrantsService } from '@src/grants/service/password.grants.service';
import { PersonCredentialsGrantsService } from '@src/grants/service/personCredentials.grants.service';
import { RefreshTokenGrantsService } from '@src/grants/service/refreshToken.grants.service';

@Injectable()
export class GrantsService {
  constructor(
    private readonly authGrantsService: AuthGrantsService,
    private readonly authorizationCodeGrantsService: AuthorizationCodeGrantsService,
    private readonly clientCredentialsGrantsService: ClientCredentialsGrantsService,
    private readonly clientGrantsService: ClientGrantsService,
    private readonly passwordGrantsService: PasswordGrantsService,
    private readonly personCredentialsGrantsService: PersonCredentialsGrantsService,
    private readonly refreshTokenGrantsService: RefreshTokenGrantsService,
  ) {}

  async auth(grantsDto: GrantsDto): Promise<any> {
    return await this.authGrantsService.auth(grantsDto);
  }

  async authorizationCode(grantsDto: GrantsDto): Promise<any> {
    return await this.authorizationCodeGrantsService.authorizationCode(grantsDto);
  }

  async client(grantsDto: GrantsDto): Promise<any> {
    return await this.clientGrantsService.client(grantsDto);
  }

  async clientCredentials(grantsDto: GrantsDto): Promise<any> {
    return await this.clientCredentialsGrantsService.clientCredentials(grantsDto);
  }

  async password(grantsDto: GrantsDto): Promise<any> {
    return await this.passwordGrantsService.password(grantsDto);
  }

  async personCredentials(grantsDto: GrantsDto): Promise<any> {
    return await this.personCredentialsGrantsService.personCredentials(grantsDto);
  }

  async refreshToken(grantsDto: GrantsDto): Promise<any> {
    return await this.refreshTokenGrantsService.refreshToken(grantsDto);
  }
}
