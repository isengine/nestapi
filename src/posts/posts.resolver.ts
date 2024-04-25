import { Resolver } from '@nestjs/graphql';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';
import { PostsService } from '@src/posts/posts.service';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';

@Resolver(PostsEntity)
export class PostsResolver extends ProtectedResolver(
  'posts',
  PostsEntity,
  PostsDto,
  PostsFilter,
)<
  PostsService,
  PostsEntity,
  PostsDto,
  PostsFilter
> {
  constructor(
    readonly service: PostsService,
  ) {
    super();
  }
}
