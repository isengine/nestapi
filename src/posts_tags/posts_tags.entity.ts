import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToMany } from 'typeorm';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { PostsEntity } from '@src/posts/posts.entity';

@ObjectType()
@Entity({ name: 'posts_tags' })
export class PostsTagsEntity extends ClosedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  title?: string;

  @Field(() => [PostsEntity], { nullable: true })
  @ManyToMany(() => PostsEntity, (post) => post.tags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: PostsEntity[];
}
