import { Module, forwardRef } from '@nestjs/common';
import { TokenGrantsService } from '@src/token_grants/token_grants.service';
import { AuthModule } from '@src/auth/auth.module';
import { ClientsModule } from '@src/clients/clients.module';
import { OAuthModule } from '@src/oauth/oauth.module';
import { PersonsModule } from '@src/persons/persons.module';
import { TokenModule } from '@src/token/token.module';

import { AuthGrantsService } from '@src/token_grants/service/auth.token_grants.service';
import { AuthorizationCodeGrantsService } from '@src/token_grants/service/authorization_code.token_grants.service';
import { ClientCredentialsGrantsService } from '@src/token_grants/service/client_credentials.token_grants.service';
import { ClientGrantsService } from '@src/token_grants/service/client.token_grants.service';
import { PasswordGrantsService } from '@src/token_grants/service/password.token_grants.service';
import { PersonCredentialsGrantsService } from '@src/token_grants/service/person_credentials.token_grants.service';
import { RefreshTokenGrantsService } from '@src/token_grants/service/refresh_token.token_grants.service';

@Module({
  controllers: [],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => OAuthModule),
    forwardRef(() => PersonsModule),
    forwardRef(() => TokenModule),
  ],
  providers: [
    TokenGrantsService,
    AuthGrantsService,
    AuthorizationCodeGrantsService,
    ClientCredentialsGrantsService,
    ClientGrantsService,
    PasswordGrantsService,
    PersonCredentialsGrantsService,
    RefreshTokenGrantsService,
  ],
  exports: [
    TokenGrantsService,
  ],
})
export class TokenGrantsModule {}
