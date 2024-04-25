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
import { CategoriesEntity } from '@src/categories/categories.entity';
import { TagsEntity } from '@src/tags/tags.entity';

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
