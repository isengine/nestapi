import { Resolver } from '@nestjs/graphql';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';
import { PostsTagsDto } from '@src/posts_tags/posts_tags.dto';
import { PostsTagsEntity } from '@src/posts_tags/posts_tags.entity';
import { PostsTagsFilter } from '@src/posts_tags/posts_tags.filter';
import { PostsTagsService } from '@src/posts_tags/posts_tags.service';

@Resolver(PostsTagsEntity)
export class PostsTagsResolver extends ClosedResolver(
  'postsTags',
  PostsTagsEntity,
  PostsTagsDto,
  PostsTagsFilter,
)<
  PostsTagsService,
  PostsTagsEntity,
  PostsTagsDto,
  PostsTagsFilter
> {
  constructor(
    readonly service: PostsTagsService,
  ) {
    super();
  }
}
