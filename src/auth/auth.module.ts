import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '@src/auth/auth.controller';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthStrategy } from '@src/auth/auth.strategy';
import { AuthResolver } from '@src/auth/auth.resolver';

import { AuthConfirmModule } from '@src/auth_confirm/auth_confirm.module';
import { AuthSessionsModule } from '@src/auth_sessions/auth_sessions.module';
import { ClientsModule } from '@src/clients/clients.module';
import { MailModule } from '@src/mail/mail.module';
import { PostsModule } from '@src/posts/posts.module';
import { RolesModule } from '@src/roles/roles.module';
import { SocketsModule } from '@src/sockets/sockets.module';
import { StrategiesModule } from '@src/strategies/strategies.module';
import { TokenModule } from '@src/token/token.module';
import { TokenGrantsModule } from '@src/token_grants/token_grants.module';
import { UsersModule } from '@src/users/users.module';

import { ConfirmAuthService } from '@src/auth/service/confirm.auth.service';
import { CreateAuthService } from '@src/auth/service/create.auth.service';
import { FindByUsernameAuthService } from '@src/auth/service/find_by_username.auth.service';
import { LoginAuthService } from '@src/auth/service/login.auth.service';
import { LogoutAuthService } from '@src/auth/service/logout.auth.service';
import { RegisterAuthService } from '@src/auth/service/register.auth.service';
import { RestoreAuthService } from '@src/auth/service/restore.auth.service';
import { RestorePrepareAuthService } from '@src/auth/service/restore_prepare.auth.service';

import { AuthFormsService } from '@src/auth/forms.service';
import { ChangeFormsService } from '@src/auth/forms.service/change.forms.service';
import { ConfirmFormsService } from '@src/auth/forms.service/confirm.forms.service';
import { HelpersFormsService } from '@src/auth/forms.service/helpers.forms.service';
import { LoginFormsService } from '@src/auth/forms.service/login.forms.service';
import { LogoutFormsService } from '@src/auth/forms.service/logout.forms.service';
import { RegisterFormsService } from '@src/auth/forms.service/register.forms.service';
import { RestoreFormsService } from '@src/auth/forms.service/restore.forms.service';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    forwardRef(() => AuthConfirmModule),
    forwardRef(() => AuthSessionsModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => MailModule),
    forwardRef(() => PostsModule),
    forwardRef(() => RolesModule),
    forwardRef(() => StrategiesModule),
    forwardRef(() => SocketsModule),
    forwardRef(() => TokenModule),
    forwardRef(() => TokenGrantsModule),
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

    AuthFormsService,
    ChangeFormsService,
    ConfirmFormsService,
    HelpersFormsService,
    LoginFormsService,
    LogoutFormsService,
    RegisterFormsService,
    RestoreFormsService,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
