import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class UsersService extends CommonService<
  UsersEntity,
  UsersDto,
  UsersFilter
> {
  constructor(
    @InjectRepository(UsersEntity)
    protected readonly repository: Repository<UsersEntity>,
  ) {
    super();
  }
}
