import { Controller } from '@nestjs/common';
import { TagsService } from '@src/tags/tags.service';
import { TagsDto } from '@src/tags/tags.dto';
import { CommonController } from '@src/common/controller/common.controller';
import { TagsEntity } from './tags.entity';
import { TagsFilter } from './tags.filter';

@Controller('tags')
export class TagsController extends CommonController(
  'Теги постов',
  TagsEntity,
  TagsDto,
)<
  TagsService,
  TagsEntity,
  TagsDto,
  TagsFilter
> {
  constructor(
    readonly service: TagsService,
  ) {
    super();
  }
}
