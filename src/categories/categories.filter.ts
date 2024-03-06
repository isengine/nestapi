import { ObjectType } from '@nestjs/graphql';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { FilterType } from '@src/typeorm/type/filter.type';

@ObjectType()
export class CategoriesFilter extends FilterType(CategoriesEntity) {}
