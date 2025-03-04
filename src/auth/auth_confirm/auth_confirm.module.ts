import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomModule } from '@src/random/random.module';
import { AuthConfirmEntity } from './auth_confirm.entity';
import { AuthConfirmService } from './auth_confirm.service';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([AuthConfirmEntity]),
    forwardRef(() => RandomModule),
  ],
  providers: [AuthConfirmService],
  exports: [AuthConfirmService],
})
export class AuthConfirmModule {}
