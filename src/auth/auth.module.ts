import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '@src/auth/strategy/jwt.strategy';
import { AuthController } from '@src/auth/auth.controller';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthResolver } from '@src/auth/auth.resolver';
import { SessionSerializer } from '@src/auth/session/serialize.session';
import { UsersModule } from '@src/users/users.module';
import { SessionsModule } from '@src/sessions/sessions.module';
import { TokenModule } from '@src/token/token.module';
import { FromClientStrategy } from '@src/auth/strategy/fromclient.strategy';
import { FormStrategy } from '@src/auth/strategy/form.strategy';
import { StrategiesModule } from '@src/strategies/strategies.module';
import { OAuthService } from '@src/auth/service/oauth.service';
import { ClientsModule } from '@src/clients/clients.module';
import { ConfirmModule } from '@src/confirm/confirm.module';
import { RolesModule } from '@src/roles/roles.module';
import { LocalStrategy } from '@src/auth/strategy/local.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    forwardRef(() => ConfirmModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => SessionsModule),
    forwardRef(() => StrategiesModule),
    forwardRef(() => TokenModule),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    ConfigModule,
  ],
  providers: [
    AuthService,
    OAuthService,
    AuthResolver,
    FromClientStrategy,
    LocalStrategy,
    FormStrategy,
    JwtStrategy,
    SessionSerializer,
  ],
  exports: [
    AuthService,
    OAuthService,
  ],
})
export class AuthModule {}
