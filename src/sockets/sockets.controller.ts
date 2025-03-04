import { Controller } from '@nestjs/common';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { SocketsDto } from './sockets.dto';
import { SocketsEntity } from './sockets.entity';
import { SocketsService } from './sockets.service';

@Controller('sockets')
export class SocketsController extends ProtectedController(
  'Подключения по сокетам',
  SocketsDto,
  SocketsEntity,
)<SocketsDto, SocketsEntity, SocketsService> {
  constructor(readonly service: SocketsService) {
    super();
  }
}
