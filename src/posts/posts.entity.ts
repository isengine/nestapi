import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { PostsCategoriesEntity } from '@src/posts_categories/posts_categories.entity';
import { PostsTagsEntity } from '@src/posts_tags/posts_tags.entity';

@ObjectType()
@Entity({ name: 'posts' })
export class PostsEntity extends ProtectedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  title: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Field({ defaultValue: () => 'CURRENT_TIMESTAMP', nullable: true })
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'published_at',
  })
  publishedAt: Date;

  @Field({ defaultValue: true, nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
    default: true,
    name: 'is_published',
  })
  isPublished: boolean;

  @Field(() => PostsCategoriesEntity, { nullable: true })
  @ManyToOne(() => PostsCategoriesEntity, (category) => category.posts, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'posts_category_id', referencedColumnName: 'id' })
  category: PostsCategoriesEntity;

  @Field(() => [PostsTagsEntity], { nullable: true })
  @ManyToMany(() => PostsTagsEntity, (tag) => tag.posts, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'posts_by_posts_tags' })
  tags: PostsTagsEntity[];
}
