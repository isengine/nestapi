import { Resolver } from '@nestjs/graphql';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';
import { TagsService } from '@src/tags/tags.service';

@Resolver(TagsEntity)
export class TagsResolver extends ClosedResolver(
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
