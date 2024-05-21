import { Controller } from '@nestjs/common';
import { PostsTagsService } from '@src/posts_tags/posts_tags.service';
import { PostsTagsDto } from '@src/posts_tags/posts_tags.dto';
import { ClosedController } from '@src/common/controller/closed.controller';
import { PostsTagsEntity } from '@src/posts_tags/posts_tags.entity';
import { PostsTagsFilter } from '@src/posts_tags/posts_tags.filter';

@Controller('posts_tags')
export class PostsTagsController extends ClosedController(
  'Теги постов',
  PostsTagsEntity,
  PostsTagsDto,
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
