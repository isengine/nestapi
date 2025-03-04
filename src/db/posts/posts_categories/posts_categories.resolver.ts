import { Resolver } from '@nestjs/graphql';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';
import { PostsCategoriesDto } from './posts_categories.dto';
import { PostsCategoriesEntity } from './posts_categories.entity';
import { PostsCategoriesService } from './posts_categories.service';

@Resolver(PostsCategoriesEntity)
export class PostsCategoriesResolver extends ClosedResolver(
  'postsCategories',
  PostsCategoriesDto,
  PostsCategoriesEntity,
)<PostsCategoriesDto, PostsCategoriesEntity, PostsCategoriesService> {
  constructor(readonly service: PostsCategoriesService) {
    super();
  }
}
