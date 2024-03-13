import { Resolver } from '@nestjs/graphql';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';
import { PostsService } from '@src/posts/posts.service';
import { CreateResolver } from '@src/typeorm/create/create.resolver';

@Resolver(PostsEntity)
export class PostsResolver extends CreateResolver(
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
