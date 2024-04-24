import { Controller, Get } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/app.decorator';
import { CommonController } from '@src/common/common.controller';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';

@Controller('posts')
export class PostsController extends CommonController(
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
