import { Controller } from '@nestjs/common';
import { CommonController } from '@src/common/common.controller';
import { TestDto } from './test.dto';
import { TestEntity } from './test.entity';
import { TestService } from './test.service';

@Controller('test')
export class TestController extends CommonController(
  'Тест',
  TestDto,
  TestEntity,
)<TestDto, TestEntity, TestService> {
  constructor(readonly service: TestService) {
    super();
  }
}
