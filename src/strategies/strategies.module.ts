import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { StrategiesService } from '@src/strategies/strategies.service';
import { StrategiesController } from '@src/strategies/strategies.controller';
import { SessionsModule } from '@src/sessions/sessions.module';
import { TokensModule } from '@src/tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { LeaderProvider } from '@src/strategies/provider/leader.provider';
import { UsersModule } from '@src/users/users.module';
import { GoogleStrategy } from '@src/strategies/strategy/google.strategy';
import { LeaderStrategy } from '@src/strategies/strategy/leader.strategy';

@Module({
  controllers: [StrategiesController],
  imports: [
    TypeOrmModule.forFeature([StrategiesEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => SessionsModule),
    forwardRef(() => TokensModule),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    StrategiesService,
    LeaderProvider,
    LeaderStrategy,
    GoogleStrategy,
  ],
  exports: [StrategiesService],
})
export class StrategiesModule {}
