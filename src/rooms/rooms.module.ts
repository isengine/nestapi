import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from '@src/rooms/rooms.controller';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { RoomsService } from '@src/rooms/rooms.service';

@Module({
  controllers: [RoomsController],
  imports: [TypeOrmModule.forFeature([RoomsEntity])],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
