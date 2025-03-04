import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { RoomsDto } from './rooms.dto';
import { RoomsEntity } from './rooms.entity';

@Injectable()
export class RoomsService extends CommonService<RoomsDto, RoomsEntity> {
  constructor(
    @InjectRepository(RoomsEntity)
    protected readonly repository: Repository<RoomsEntity>,
  ) {
    super();
  }
}
