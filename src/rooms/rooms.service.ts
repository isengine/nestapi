import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { RoomsFilter } from '@src/rooms/rooms.filter';
import { CommonService } from '@src/common/service/common.service';

@Injectable()
export class RoomsService extends CommonService<
  RoomsEntity,
  RoomsDto,
  RoomsFilter
> {
  constructor(
    @InjectRepository(RoomsEntity)
    protected readonly repository: Repository<RoomsEntity>,
  ) {
    super();
  }
}
