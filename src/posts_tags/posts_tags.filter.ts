import { ObjectType } from '@nestjs/graphql';
import { PostsTagsEntity } from '@src/posts_tags/posts_tags.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class PostsTagsFilter extends FilterType(PostsTagsEntity) {}
