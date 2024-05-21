import { ObjectType } from '@nestjs/graphql';
import { PostsCategoriesEntity } from '@src/posts_categories/posts_categories.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class PostsCategoriesFilter extends FilterType(PostsCategoriesEntity) {}
