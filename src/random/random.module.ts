import { Module } from '@nestjs/common';
import { RandomController } from '@src/random/random.controller';
import { RandomService } from '@src/random/random.service';
import { RandomResolver } from '@src/random/random.resolver';

@Module({
  controllers: [RandomController],
  imports: [],
  providers: [RandomService, RandomResolver],
  exports: [RandomService],
})
export class RandomModule {}
