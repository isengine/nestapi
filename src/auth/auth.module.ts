import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthStrategy } from '@src/auth/auth.strategy';
import { AuthResolver } from '@src/auth/auth.resolver';

import { AuthController } from '@src/auth/auth.controller';
import { FormsAuthController } from '@src/auth/controller/forms.auth.controller';
import { MethodsAuthController } from '@src/auth/controller/methods.auth.controller';
import { RenderAuthController } from '@src/auth/controller/render.auth.controller';

import { FormsAuthService } from '@src/auth/service/forms.auth.service';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';

import { ChangeAuthHandler } from '@src/auth/handler/change.auth.handler';
import { ConfirmAuthHandler } from '@src/auth/handler/confirm.auth.handler';
import { LogoutAuthHandler } from '@src/auth/handler/logout.auth.handler';
import { RegisterAuthHandler } from '@src/auth/handler/register.auth.handler';
import { ResetAuthHandler } from '@src/auth/handler/reset.auth.handler';

import { AuthConfirmModule } from '@src/auth_confirm/auth_confirm.module';
import { AuthRolesModule } from '@src/auth_roles/auth_roles.module';
import { AuthSessionsModule } from '@src/auth_sessions/auth_sessions.module';
import { AuthStrategiesModule } from '@src/auth_strategies/auth_strategies.module';
import { ClientsModule } from '@src/clients/clients.module';
import { MailModule } from '@src/mail/mail.module';
import { PostsModule } from '@src/posts/posts.module';
import { SocketsModule } from '@src/sockets/sockets.module';
import { TokenModule } from '@src/token/token.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  controllers: [
    AuthController,
    FormsAuthController,
    MethodsAuthController,
    RenderAuthController,
  ],
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    forwardRef(() => AuthConfirmModule),
    forwardRef(() => AuthRolesModule),
    forwardRef(() => AuthSessionsModule),
    forwardRef(() => AuthStrategiesModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => MailModule),
    forwardRef(() => PostsModule),
    forwardRef(() => SocketsModule),
    forwardRef(() => TokenModule),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    AuthService,
    AuthStrategy,
    AuthResolver,
    FormsAuthService,
    MethodsAuthService,

    ChangeAuthHandler,
    ConfirmAuthHandler,
    LogoutAuthHandler,
    RegisterAuthHandler,
    ResetAuthHandler,
  ],
  exports: [
    AuthService,
    FormsAuthService,
    MethodsAuthService,
  ],
})
export class AuthModule {}
