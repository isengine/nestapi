import { Resolver } from '@nestjs/graphql';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { PostsDto } from './posts.dto';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Resolver(PostsEntity)
export class PostsResolver extends ProtectedResolver(
  'posts',
  PostsDto,
  PostsEntity,
)<PostsDto, PostsEntity, PostsService> {
  constructor(readonly service: PostsService) {
    super();
  }
}
