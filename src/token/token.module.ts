import { Module, forwardRef } from '@nestjs/common';
import { TokenController } from '@src/token/token.controller';
import { TokenService } from '@src/token/token.service';
import { TokenResolver } from '@src/token/token.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@src/config/jwt.config';
import { ClientsModule } from '@src/clients/clients.module';

import { OneHandler } from '@src/token/handler/one.handler';
import { PairHandler } from '@src/token/handler/pair.handler';
import { PrepareHandler } from '@src/token/handler/prepare.handler';
import { RefreshHandler } from '@src/token/handler/refresh.handler';
import { VerifyHandler } from '@src/token/handler/verify.handler';
import { GrantsTokenService } from '@src/token/service/grants.token.service';

import { AuthorizationCodeGrant } from '@src/token/grant/authorization_code.grant';
import { ClientCredentialsGrant } from '@src/token/grant/client_credentials.grant';
import { KeyGrant } from '@src/token/grant/key.grant';
import { PasswordGrant } from '@src/token/grant/password.grant';
import { RefreshTokenGrant } from '@src/token/grant/refresh_token.grant';
import { AuthModule } from '@src/auth/auth.module';
import { UsersModule } from '@src/db/users/users.module';

@Module({
  controllers: [TokenController],
  imports: [
    forwardRef(() => ConfigModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    forwardRef(() => ClientsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    TokenService,
    TokenResolver,

    GrantsTokenService,
    AuthorizationCodeGrant,
    ClientCredentialsGrant,
    KeyGrant,
    PasswordGrant,
    RefreshTokenGrant,

    OneHandler,
    PairHandler,
    PrepareHandler,
    RefreshHandler,
    VerifyHandler,
  ],
  exports: [TokenService, GrantsTokenService],
})
export class TokenModule {}
