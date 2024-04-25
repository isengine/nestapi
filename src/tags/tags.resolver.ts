import { Resolver } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/resolver/common.resolver';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';
import { TagsService } from '@src/tags/tags.service';

@Resolver(TagsEntity)
export class TagsResolver extends CommonResolver(
  'tags',
  TagsEntity,
  TagsDto,
  TagsFilter,
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
