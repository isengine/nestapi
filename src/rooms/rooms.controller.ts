import { Controller } from '@nestjs/common';
import { RoomsService } from '@src/rooms/rooms.service';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { CommonController } from '@src/common/common.controller';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { RoomsFilter } from '@src/rooms/rooms.filter';

@Controller('rooms')
export class RoomsController extends CommonController<
  RoomsService,
  RoomsEntity,
  RoomsDto,
  RoomsFilter
> {
  constructor(
    protected readonly service: RoomsService,
  ) {
    super();
  }
}
