import { ObjectType } from '@nestjs/graphql';
import { PostsEntity } from '@src/posts/posts.entity';
import { FilterType } from '@src/typeorm/types/filter.type';

@ObjectType()
export class PostsFilter extends FilterType(PostsEntity) {}
