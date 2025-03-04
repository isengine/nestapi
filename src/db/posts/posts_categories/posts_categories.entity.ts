import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, OneToMany } from 'typeorm';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import {
  CreatedColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { PostsEntity } from '../posts.entity';

@ObjectType()
@Entity({ name: 'posts_categories' })
export class PostsCategoriesEntity extends ClosedEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('title')
  title?: string;

  @Field(() => [PostsEntity], { nullable: true })
  @OneToMany(() => PostsEntity, (post) => post.category, {
    cascade: true,
  })
  posts: PostsEntity[];
}
