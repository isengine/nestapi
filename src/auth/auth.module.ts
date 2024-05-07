import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '@src/auth/auth.controller';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthResolver } from '@src/auth/auth.resolver';
import { OAuthService } from '@src/auth/service/oauth.service';
import { SessionSerializer } from '@src/auth/session/serialize.session';
import { JwtStrategy } from '@src/auth/strategy/jwt.strategy';

import { ClientsModule } from '@src/clients/clients.module';
import { ConfirmModule } from '@src/confirm/confirm.module';
import { PostsModule } from '@src/posts/posts.module';
import { RolesModule } from '@src/roles/roles.module';
import { SessionsModule } from '@src/sessions/sessions.module';
import { SocketsModule } from '@src/sockets/sockets.module';
import { StrategiesModule } from '@src/strategies/strategies.module';
import { TokenModule } from '@src/token/token.module';
import { UsersModule } from '@src/users/users.module';

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
    OAuthService,
    AuthResolver,
    JwtStrategy,
    SessionSerializer,
  ],
  exports: [
    AuthService,
    OAuthService,
  ],
})
export class AuthModule {}
