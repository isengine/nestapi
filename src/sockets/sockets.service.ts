import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { RoomsService } from '@src/rooms/rooms.service';
import { SocketsDto } from './sockets.dto';
import { SocketsEntity } from './sockets.entity';

@Injectable()
export class SocketsService extends CommonService<SocketsDto, SocketsEntity> {
  constructor(
    @InjectRepository(SocketsEntity)
    protected readonly repository: Repository<SocketsEntity>,
    protected readonly roomsService: RoomsService,
  ) {
    super();
  }

  async create(sockets: SocketsDto): Promise<SocketsEntity> {
    const roomId = sockets.room?.id;
    if (roomId) {
      const room = await this.roomsService.findOne({ id: roomId });
      sockets.room = room;
    }
    delete sockets.room;
    return await super.create(sockets);
  }
}
