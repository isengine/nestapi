import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '@src/auth/strategy/jwt.strategy';
import { AuthController } from '@src/auth/auth.controller';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthResolver } from '@src/auth/auth.resolver';
import { GoogleStrategy } from '@src/auth/strategy/google.strategy';
import { SessionSerializer } from '@src/auth/session/serialize.session';
import { UsersModule } from '@src/users/users.module';
import { SessionsModule } from '@src/sessions/sessions.module';
import { LeaderStrategy } from '@src/auth/strategy/leader.strategy';
import { LeaderProvider } from '@src/auth/provider/leader.provider';
import { TokensModule } from '@src/tokens/tokens.module';
import { FromClientStrategy } from '@src/auth/strategy/fromclient.strategy';
import { FormStrategy } from '@src/auth/strategy/form.strategy';
import { StrategiesModule } from '@src/strategies/strategies.module';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    forwardRef(() => SessionsModule),
    forwardRef(() => StrategiesModule),
    forwardRef(() => TokensModule),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    FromClientStrategy,
    FormStrategy,
    JwtStrategy,
    LeaderStrategy,
    GoogleStrategy,
    LeaderProvider,
    SessionSerializer,
  ],
  exports: [AuthService],
})
export class AuthModule {}
