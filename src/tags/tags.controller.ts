import { Controller } from '@nestjs/common';
import { TagsService } from '@src/tags/tags.service';
import { TagsDto } from '@src/tags/tags.dto';
import { ClosedController } from '@src/common/controller/closed.controller';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';

@Controller('tags')
export class TagsController extends ClosedController(
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
