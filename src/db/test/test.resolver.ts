import { Resolver } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/common.resolver';
import { TestDto } from './test.dto';
import { TestEntity } from './test.entity';
import { TestService } from './test.service';

@Resolver(TestEntity)
export class TestResolver extends CommonResolver('test', TestDto, TestEntity)<
  TestDto,
  TestEntity,
  TestService
> {
  constructor(readonly service: TestService) {
    super();
  }
}
