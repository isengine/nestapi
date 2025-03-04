import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthEntity } from './auth.entity';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

import { FormsAuthController } from './controller/forms.auth.controller';
import { MethodsAuthController } from './controller/methods.auth.controller';
import { OpenAuthController } from './controller/open.auth.controller';
import { ChangeAuthHandler } from './handler/change.auth.handler';
import { ConfirmAuthHandler } from './handler/confirm.auth.handler';
import { HashAuthHandler } from './handler/hash.auth.handler';
import { LogoutAuthHandler } from './handler/logout.auth.handler';
import { RegisterAuthHandler } from './handler/register.auth.handler';
import { ResetAuthHandler } from './handler/reset.auth.handler';
import { FormsAuthService } from './service/forms.auth.service';
import { MethodsAuthService } from './service/methods.auth.service';
import { OpenAuthService } from './service/open.auth.service';

import { AuthConfirmModule } from './auth_confirm/auth_confirm.module';
import { AuthSessionsModule } from './auth_sessions/auth_sessions.module';
import { AuthStrategiesModule } from './auth_strategies/auth_strategies.module';

import { ClientsModule } from '@src/clients/clients.module';
import { MailModule } from '@src/mail/mail.module';
import { TokenModule } from '@src/token/token.module';
import { UsersModule } from '@src/db/users/users.module';

@Module({
  controllers: [
    AuthController,
    FormsAuthController,
    MethodsAuthController,
    OpenAuthController,
  ],
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    forwardRef(() => AuthConfirmModule),
    forwardRef(() => AuthSessionsModule),
    forwardRef(() => AuthStrategiesModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => MailModule),
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
    OpenAuthService,

    ChangeAuthHandler,
    ConfirmAuthHandler,
    HashAuthHandler,
    LogoutAuthHandler,
    RegisterAuthHandler,
    ResetAuthHandler,
  ],
  exports: [AuthService, FormsAuthService, MethodsAuthService, OpenAuthService],
})
export class AuthModule {}
