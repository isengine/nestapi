import { Resolver } from '@nestjs/graphql';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';
import { TestDto } from './test.dto';
import { TestEntity } from './test.entity';
import { TestService } from './test.service';

@Resolver(TestEntity)
export class TestResolver extends ClosedResolver('test', TestDto, TestEntity)<
  TestDto,
  TestEntity,
  TestService
> {
  constructor(readonly service: TestService) {
    super();
  }
}
