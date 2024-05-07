import { Controller } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesDto } from '@src/categories/categories.dto';
import { ClosedController } from '@src/common/controller/closed.controller';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesFilter } from '@src/categories/categories.filter';

@Controller('categories')
export class CategoriesController extends ClosedController(
  'Категории постов',
  CategoriesEntity,
  CategoriesDto,
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
