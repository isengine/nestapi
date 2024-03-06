import { ObjectType } from '@nestjs/graphql';
import { PostsEntity } from '@src/posts/posts.entity';
import { FilterType } from '@src/typeorm/type/filter.type';

@ObjectType()
export class PostsFilter extends FilterType(PostsEntity) {}
