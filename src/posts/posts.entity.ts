import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { UsersEntity } from '@src/users/users.entity';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { TagsEntity } from '@src/tags/tags.entity';

@ObjectType()
@Entity({ name: 'posts' })
export class PostsEntity extends CommonEntity {
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

  @Field({ nullable: true })
  @Column({
    type: 'date',
    nullable: true,
    name: 'published_at',
  })
  publishedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
    name: 'is_published',
  })
  isPublished: boolean;

  @ManyToOne(() => UsersEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UsersEntity;

  @Field(() => CategoriesEntity, { nullable: true })
  @ManyToOne(() => CategoriesEntity, (category) => category.posts, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CategoriesEntity;

  @Field(() => [TagsEntity], { nullable: true })
  @ManyToMany(() => TagsEntity, (tag) => tag.posts, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'posts_by_tags' })
  tags: TagsEntity[];
}
