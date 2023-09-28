import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToMany } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { PostsEntity } from '@src/posts/posts.entity';

@ObjectType()
@Entity({ name: 'tags' })
export class TagsEntity extends CommonEntity {
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
