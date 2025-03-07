import { Controller } from '@nestjs/common';
import { ClosedController } from '@src/common/controller/closed.controller';
import { TestDto } from './test.dto';
import { TestEntity } from './test.entity';
import { TestService } from './test.service';

@Controller('test')
export class TestController extends ClosedController(
  'Тест',
  TestDto,
  TestEntity,
)<TestDto, TestEntity, TestService> {
  constructor(readonly service: TestService) {
    super();
  }
}
