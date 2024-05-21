import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';

import { OAuthController } from '@src/oauth/oauth.controller';
import { OAuthService } from '@src/oauth/oauth.service';
import { OAuthResolver } from '@src/oauth/oauth.resolver';

import { ClientsModule } from '@src/clients/clients.module';
import { ConfirmModule } from '@src/confirm/confirm.module';
import { PostsModule } from '@src/posts/posts.module';
import { RolesModule } from '@src/roles/roles.module';
import { SessionsModule } from '@src/sessions/sessions.module';
import { SocketsModule } from '@src/sockets/sockets.module';
import { StrategiesModule } from '@src/strategies/strategies.module';
import { TokenModule } from '@src/token/token.module';
import { UsersModule } from '@src/users/users.module';

import { CodeOAuthService } from '@src/oauth/service/code.oauth.service';
import { CodeGenerateOAuthService } from '@src/oauth/service/codeGenerate.oauth.service';
import { CodeVerifyOAuthService } from '@src/oauth/service/codeVerify.oauth.service';
import { TokenOAuthService } from '@src/oauth/service/token.oauth.service';
import { VerifyOAuthService } from '@src/oauth/service/verify.oauth.service';

@Module({
  controllers: [OAuthController],
  imports: [
    forwardRef(() => ClientsModule),
    forwardRef(() => ConfirmModule),
    forwardRef(() => PostsModule),
    forwardRef(() => RolesModule),
    forwardRef(() => SessionsModule),
    forwardRef(() => StrategiesModule),
    forwardRef(() => SocketsModule),
    forwardRef(() => TokenModule),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    OAuthService,
    OAuthResolver,

    CodeOAuthService,
    CodeGenerateOAuthService,
    CodeVerifyOAuthService,
    TokenOAuthService,
    VerifyOAuthService,
  ],
  exports: [
    OAuthService,
  ],
})
export class OAuthModule {}
