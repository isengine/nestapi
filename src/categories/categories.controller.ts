import { Controller } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CommonController } from '@src/common/common.controller';
import { CategoriesEntity } from './categories.entity';
import { CategoriesFilter } from './categories.filter';

@Controller('categories')
export class CategoriesController extends CommonController(
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
