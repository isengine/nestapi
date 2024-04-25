import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomModule } from '@src/random/random.module';
import { ConfirmEntity } from '@src/confirm/confirm.entity';
import { ConfirmService } from '@src/confirm/confirm.service';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ConfirmEntity]),
    forwardRef(() => RandomModule),
  ],
  providers: [ConfirmService],
  exports: [ConfirmService],
})
export class ConfirmModule {}
