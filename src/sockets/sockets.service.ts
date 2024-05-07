import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { RoomsService } from '@src/rooms/rooms.service';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class SocketsService extends CommonService<
  SocketsEntity,
  SocketsDto,
  SocketsFilter
> {
  constructor(
    @InjectRepository(SocketsEntity)
    protected readonly repository: Repository<SocketsEntity>,
    protected readonly roomsService: RoomsService,
  ) {
    super();
  }

  async create(
    socketsDto: SocketsDto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<SocketsEntity> {
    const roomId = socketsDto.room?.id;
    if (roomId) {
      const room = await this.roomsService.findOne(roomId);
      socketsDto.room = room;
    }
    delete socketsDto.room;
    return await super.create(socketsDto, relationsDto, authId);
  }
}
