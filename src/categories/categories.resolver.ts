import { Resolver } from '@nestjs/graphql';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesFilter } from '@src/categories/categories.filter';
import { CategoriesService } from '@src/categories/categories.service';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';

@Resolver(CategoriesEntity)
export class CategoriesResolver extends ClosedResolver(
  'categories',
  CategoriesEntity,
  CategoriesDto,
  CategoriesFilter,
)<
  CategoriesService,
  CategoriesEntity,
  CategoriesDto,
  CategoriesFilter
> {
  constructor(
    readonly service: CategoriesService,
  ) {
    super();
  }
}
