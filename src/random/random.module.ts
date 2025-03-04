import { Module } from '@nestjs/common';
import { RandomController } from './random.controller';
import { RandomResolver } from './random.resolver';
import { RandomService } from './random.service';

@Module({
  controllers: [RandomController],
  imports: [],
  providers: [RandomService, RandomResolver],
  exports: [RandomService],
})
export class RandomModule {}
