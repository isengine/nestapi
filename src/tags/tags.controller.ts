import { Controller } from '@nestjs/common';
import { TagsService } from '@src/tags/tags.service';
import { TagsDto } from '@src/tags/tags.dto';
import { CommonController } from '@src/common/common.controller';
import { TagsEntity } from './tags.entity';
import { TagsFilter } from './tags.filter';

@Controller('tags')
export class TagsController extends CommonController<
  TagsService,
  TagsEntity,
  TagsDto,
  TagsFilter
> {
  constructor(
    protected readonly service: TagsService,
  ) {
    super();
  }
}
