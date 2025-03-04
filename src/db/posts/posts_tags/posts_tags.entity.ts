import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToMany } from 'typeorm';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import {
  CreatedColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { PostsEntity } from '../posts.entity';

@ObjectType()
@Entity({ name: 'posts_tags' })
export class PostsTagsEntity extends ClosedEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('title')
  title?: string;

  @Field(() => [PostsEntity], { nullable: true })
  @ManyToMany(() => PostsEntity, (post) => post.tags, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: PostsEntity[];
}
