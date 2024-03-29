import { ObjectType } from '@nestjs/graphql';
import { TagsEntity } from '@src/tags/tags.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class TagsFilter extends FilterType(TagsEntity) {}
