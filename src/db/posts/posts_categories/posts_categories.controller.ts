import { Controller } from '@nestjs/common';
import { ClosedController } from '@src/common/controller/closed.controller';
import { PostsCategoriesDto } from './posts_categories.dto';
import { PostsCategoriesEntity } from './posts_categories.entity';
import { PostsCategoriesService } from './posts_categories.service';

@Controller('posts/categories')
export class PostsCategoriesController extends ClosedController(
  'Категории постов',
  PostsCategoriesDto,
  PostsCategoriesEntity,
)<PostsCategoriesDto, PostsCategoriesEntity, PostsCategoriesService> {
  constructor(readonly service: PostsCategoriesService) {
    super();
  }
}
