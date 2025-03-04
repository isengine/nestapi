import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '@src/token/token.module';
import { UsersModule } from '@src/db/users/users.module';
import { AuthStrategiesController } from './auth_strategies.controller';
import { AuthStrategiesEntity } from './auth_strategies.entity';
import { AuthStrategiesService } from './auth_strategies.service';
import { LeaderProvider } from './provider/leader.provider';
import { OauthProvider } from './provider/oauth.provider';
import { UntiProvider } from './provider/unti.provider';
import { SessionSerializer } from './serializer/session.serializer';
import { GoogleStrategy } from './strategy/google.strategy';
import { LeaderStrategy } from './strategy/leader.strategy';
import { OauthStrategy } from './strategy/oauth.strategy';
import { UntiStrategy } from './strategy/unti.strategy';
import { AuthModule } from '../auth.module';
import { AuthSessionsModule } from '../auth_sessions/auth_sessions.module';

@Module({
  controllers: [AuthStrategiesController],
  imports: [
    TypeOrmModule.forFeature([AuthStrategiesEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => AuthSessionsModule),
    forwardRef(() => TokenModule),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    SessionSerializer,
    AuthStrategiesService,
    GoogleStrategy,
    LeaderProvider,
    LeaderStrategy,
    UntiProvider,
    UntiStrategy,
    OauthStrategy,
    OauthProvider,
  ],
  exports: [AuthStrategiesService],
})
export class AuthStrategiesModule {}
