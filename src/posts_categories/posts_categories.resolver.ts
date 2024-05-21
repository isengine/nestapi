import { Resolver } from '@nestjs/graphql';
import { PostsCategoriesDto } from '@src/posts_categories/posts_categories.dto';
import { PostsCategoriesEntity } from '@src/posts_categories/posts_categories.entity';
import { PostsCategoriesFilter } from '@src/posts_categories/posts_categories.filter';
import { PostsCategoriesService } from '@src/posts_categories/posts_categories.service';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';

@Resolver(PostsCategoriesEntity)
export class PostsCategoriesResolver extends ClosedResolver(
  'postsCategories',
  PostsCategoriesEntity,
  PostsCategoriesDto,
  PostsCategoriesFilter,
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
