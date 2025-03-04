import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Module({
  controllers: [RoomsController],
  imports: [TypeOrmModule.forFeature([RoomsEntity])],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
