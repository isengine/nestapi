import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToMany, JoinColumn, JoinTable, ManyToOne } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { PostsCategoriesEntity } from './posts_categories/posts_categories.entity';
import { PostsTagsEntity } from './posts_tags/posts_tags.entity';
import {
  BooleanColumn,
  CreatedColumn,
  DateColumn,
  TextColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';

@ObjectType()
@Entity({ name: 'posts' })
export class PostsEntity extends ProtectedEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('title')
  title: string;

  @TextColumn('content')
  content: string;

  @DateColumn('published_at')
  publishedAt: Date;

  @BooleanColumn('is_published')
  isPublished: boolean;

  @Field(() => PostsCategoriesEntity, { nullable: true })
  @ManyToOne(() => PostsCategoriesEntity, (category) => category.posts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'posts_category_id', referencedColumnName: 'id' })
  category: PostsCategoriesEntity;

  @Field(() => [PostsTagsEntity], { nullable: true })
  @ManyToMany(() => PostsTagsEntity, (tag) => tag.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'posts_by_posts_tags' })
  tags: PostsTagsEntity[];
}
