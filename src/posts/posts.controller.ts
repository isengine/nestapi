import { Controller } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';

@Controller('posts')
export class PostsController extends ProtectedController(
  'Посты',
  PostsEntity,
  PostsDto,
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
