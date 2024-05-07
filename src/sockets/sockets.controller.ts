import { Controller } from '@nestjs/common';
import { SocketsService } from '@src/sockets/sockets.service';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';

@Controller('sockets')
export class SocketsController extends ProtectedController(
  'Подключения по сокетам',
  SocketsEntity,
  SocketsDto,
)<
  SocketsService,
  SocketsEntity,
  SocketsDto,
  SocketsFilter
> {
  constructor(
    readonly service: SocketsService,
  ) {
    super();
  }
}
