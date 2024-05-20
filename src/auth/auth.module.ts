import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '@src/auth/auth.controller';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthStrategy } from '@src/auth/auth.strategy';
import { AuthResolver } from '@src/auth/auth.resolver';

import { ClientsModule } from '@src/clients/clients.module';
import { ConfirmModule } from '@src/confirm/confirm.module';
import { PostsModule } from '@src/posts/posts.module';
import { RolesModule } from '@src/roles/roles.module';
import { SessionsModule } from '@src/sessions/sessions.module';
import { SocketsModule } from '@src/sockets/sockets.module';
import { StrategiesModule } from '@src/strategies/strategies.module';
import { TokenModule } from '@src/token/token.module';
import { UsersModule } from '@src/users/users.module';

import { ConfirmAuthService } from '@src/auth/service/confirm.auth.service';
import { CreateAuthService } from '@src/auth/service/create.auth.service';
import { FindByUsernameAuthService } from '@src/auth/service/findByUsername.auth.service';
import { LoginAuthService } from '@src/auth/service/login.auth.service';
import { LogoutAuthService } from '@src/auth/service/logout.auth.service';
import { RegisterAuthService } from '@src/auth/service/register.auth.service';
import { RestoreAuthService } from '@src/auth/service/restore.auth.service';
import { RestorePrepareAuthService } from '@src/auth/service/restorePrepare.auth.service';

import { CodeAuthService } from '@src/auth/service/code.auth.service';
import { CodeGenerateAuthService } from '@src/auth/service/codeGenerate.auth.service';
import { CodeVerifyAuthService } from '@src/auth/service/codeVerify.auth.service';
import { TokenAuthService } from '@src/auth/service/token.auth.service';
import { VerifyAuthService } from '@src/auth/service/verify.auth.service';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
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
    AuthService,
    AuthStrategy,
    AuthResolver,

    ConfirmAuthService,
    CreateAuthService,
    FindByUsernameAuthService,
    LoginAuthService,
    LogoutAuthService,
    RegisterAuthService,
    RestoreAuthService,
    RestorePrepareAuthService,

    CodeAuthService,
    CodeGenerateAuthService,
    CodeVerifyAuthService,
    TokenAuthService,
    VerifyAuthService,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
