import { ObjectType } from '@nestjs/graphql';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class CategoriesFilter extends FilterType(CategoriesEntity) {}
