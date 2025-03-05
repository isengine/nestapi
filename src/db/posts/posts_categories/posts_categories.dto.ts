import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  DtoColumn,
  DtoCreatedColumn,
  DtoUpdatedColumn,
} from '@src/common/common.column';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { PostsDto } from '../posts.dto';

@InputType()
export class PostsCategoriesDto extends ClosedDto {
  @DtoCreatedColumn()
  createdAt?: Date;

  @DtoUpdatedColumn()
  updatedAt?: Date;

  @DtoColumn('Название категории')
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Данные записей posts, входящих в категорию',
    type: () => [PostsDto],
  })
  @Field(() => [PostsDto], { nullable: true })
  posts?: PostsDto[];
}
