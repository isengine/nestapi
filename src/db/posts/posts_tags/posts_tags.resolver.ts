import { Resolver } from '@nestjs/graphql';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';
import { PostsTagsDto } from './posts_tags.dto';
import { PostsTagsEntity } from './posts_tags.entity';
import { PostsTagsService } from './posts_tags.service';

@Resolver(PostsTagsEntity)
export class PostsTagsResolver extends ClosedResolver(
  'postsTags',
  PostsTagsDto,
  PostsTagsEntity,
)<PostsTagsDto, PostsTagsEntity, PostsTagsService> {
  constructor(readonly service: PostsTagsService) {
    super();
  }
}
