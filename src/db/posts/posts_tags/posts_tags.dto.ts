import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { PostsDto } from '../posts.dto';

@InputType()
export class PostsTagsDto extends ClosedDto {
  @ApiProperty({
    required: false,
    description: 'Дата и время создания записи, назначается автоматически',
  })
  @Field({ nullable: true })
  createdAt?: Date;

  @ApiProperty({
    required: false,
    description:
      'Дата и время последнего обновления записи, назначается автоматически',
  })
  @Field({ nullable: true })
  updatedAt?: Date;

  @ApiProperty({
    required: false,
    description: 'Название тега',
  })
  @Field({ nullable: true })
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Массив данных постов, связанных с этим тегом',
    type: () => [PostsDto],
  })
  @Field(() => [PostsDto], { nullable: true })
  posts?: PostsDto[];
}
