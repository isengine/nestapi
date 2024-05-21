import { Module, forwardRef } from '@nestjs/common';
import { GrantsService } from '@src/grants/grants.service';
import { AuthModule } from '@src/auth/auth.module';
import { ClientsModule } from '@src/clients/clients.module';
import { OAuthModule } from '@src/oauth/oauth.module';
import { PersonsModule } from '@src/persons/persons.module';
import { TokenModule } from '@src/token/token.module';
import { AuthGrantsService } from '@src/grants/service/auth.grants.service';
import { AuthorizationCodeGrantsService } from '@src/grants/service/authorizationCode.grants.service';
import { ClientCredentialsGrantsService } from '@src/grants/service/clientCredentials.grants.service';
import { ClientGrantsService } from '@src/grants/service/client.grants.service';
import { PasswordGrantsService } from '@src/grants/service/password.grants.service';
import { PersonCredentialsGrantsService } from '@src/grants/service/personCredentials.grants.service';
import { RefreshTokenGrantsService } from '@src/grants/service/refreshToken.grants.service';

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
    GrantsService,
    AuthGrantsService,
    AuthorizationCodeGrantsService,
    ClientCredentialsGrantsService,
    ClientGrantsService,
    PasswordGrantsService,
    PersonCredentialsGrantsService,
    RefreshTokenGrantsService,
  ],
  exports: [
    GrantsService,
  ],
})
export class GrantsModule {}
