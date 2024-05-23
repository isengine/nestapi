import { Controller } from '@nestjs/common';
import { PostsCategoriesService } from '@src/posts_categories/posts_categories.service';
import { PostsCategoriesDto } from '@src/posts_categories/posts_categories.dto';
import { ClosedController } from '@src/common/controller/closed.controller';
import { PostsCategoriesEntity } from '@src/posts_categories/posts_categories.entity';
import { PostsCategoriesFilter } from '@src/posts_categories/posts_categories.filter';

@Controller('posts/categories')
export class PostsCategoriesController extends ClosedController(
  'Категории постов',
  PostsCategoriesEntity,
  PostsCategoriesDto,
)<
  PostsCategoriesService,
  PostsCategoriesEntity,
  PostsCategoriesDto,
  PostsCategoriesFilter
> {
  constructor(
    readonly service: PostsCategoriesService,
  ) {
    super();
  }
}
