import { Controller } from '@nestjs/common';
import { CommonController } from '@src/common/common.controller';
import { RoomsDto } from './rooms.dto';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController extends CommonController(
  'Комнаты подключений по сокетам',
  RoomsDto,
  RoomsEntity,
)<RoomsDto, RoomsEntity, RoomsService> {
  constructor(readonly service: RoomsService) {
    super();
  }
}
