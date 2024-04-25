import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '@src/common/entity/common.entity';
import { PostsEntity } from '@src/posts/posts.entity';

@ObjectType()
@Entity({ name: 'categories' })
export class CategoriesEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  title?: string;

  @Field(() => [PostsEntity], { nullable: true })
  @OneToMany(() => PostsEntity, (post) => post.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: PostsEntity[];
}
