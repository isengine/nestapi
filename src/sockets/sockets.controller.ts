import { Controller } from '@nestjs/common';
import { SocketsService } from '@src/sockets/sockets.service';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { CommonController } from '@src/common/common.controller';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';

@Controller('sockets')
export class SocketsController extends CommonController<
  SocketsService,
  SocketsEntity,
  SocketsDto,
  SocketsFilter
> {
  constructor(
    protected readonly service: SocketsService,
  ) {
    super();
  }
}
