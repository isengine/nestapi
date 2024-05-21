import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { PostsEntity } from '@src/posts/posts.entity';

@ObjectType()
@Entity({ name: 'posts_categories' })
export class PostsCategoriesEntity extends ClosedEntity {
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
