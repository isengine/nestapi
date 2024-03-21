import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { StrategiesService } from '@src/strategies/strategies.service';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([StrategiesEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [StrategiesService],
  exports: [StrategiesService],
})
export class StrategiesModule {}
