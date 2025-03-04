import { Controller } from '@nestjs/common';
import { ClosedController } from '@src/common/controller/closed.controller';
import { PostsTagsDto } from './posts_tags.dto';
import { PostsTagsEntity } from './posts_tags.entity';
import { PostsTagsService } from './posts_tags.service';

@Controller('posts/tags')
export class PostsTagsController extends ClosedController(
  'Теги постов',
  PostsTagsDto,
  PostsTagsEntity,
)<PostsTagsDto, PostsTagsEntity, PostsTagsService> {
  constructor(readonly service: PostsTagsService) {
    super();
  }
}
