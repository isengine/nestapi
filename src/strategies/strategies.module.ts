import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { StrategiesService } from '@src/strategies/strategies.service';
import { StrategiesController } from '@src/strategies/strategies.controller';
import { SessionsModule } from '@src/sessions/sessions.module';
import { TokenModule } from '@src/token/token.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@src/users/users.module';
import { SessionSerializer } from '@src/strategies/serializer/session.serializer';
import { GoogleStrategy } from '@src/strategies/strategy/google.strategy';
import { OauthStrategy } from '@src/strategies/strategy/oauth.strategy';
import { LeaderStrategy } from '@src/strategies/strategy/leader.strategy';
import { LeaderStrategiesProvider } from '@src/strategies/provider/leader.strategies.provider';

@Module({
  controllers: [StrategiesController],
  imports: [
    TypeOrmModule.forFeature([StrategiesEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => SessionsModule),
    forwardRef(() => TokenModule),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    SessionSerializer,
    StrategiesService,
    GoogleStrategy,
    LeaderStrategiesProvider,
    LeaderStrategy,
    OauthStrategy,
  ],
  exports: [StrategiesService],
})
export class StrategiesModule {}
