import { Controller } from '@nestjs/common';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { PostsDto } from './posts.dto';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController extends ProtectedController(
  'Посты',
  PostsDto,
  PostsEntity,
)<PostsDto, PostsEntity, PostsService> {
  constructor(readonly service: PostsService) {
    super();
  }
}
