import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { TestDto } from './test.dto';
import { TestEntity } from './test.entity';

@Injectable()
export class TestService extends CommonService<TestDto, TestEntity> {
  constructor(
    @InjectRepository(TestEntity)
    protected readonly repository: Repository<TestEntity>,
  ) {
    super();
  }
}
