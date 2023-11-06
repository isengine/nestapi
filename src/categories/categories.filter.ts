import { ObjectType } from '@nestjs/graphql';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { FilterType } from '@src/typeorm/types/filter.type';

@ObjectType()
export class CategoriesFilter extends FilterType(CategoriesEntity) {}
