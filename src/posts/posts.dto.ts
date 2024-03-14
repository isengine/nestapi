import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/dto/common.dto';
import { TagsDto } from '@src/tags/tags.dto';
import { CategoriesDto } from '@src/categories/categories.dto';

@InputType()
export class PostsDto extends CommonDto {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  publishedAt: Date;

  @Field({ nullable: true })
  isPublished: boolean;

  @Field(() => CategoriesDto, { nullable: true })
  category?: CategoriesDto;

  @Field(() => [String || Number], { nullable: true })
  categoryId?: number;

  @Field(() => [TagsDto], { nullable: true })
  tags?: TagsDto[];

  @Field(() => [String || Number], { nullable: true })
  tagsList?: Array<string | number>;

  @Field(() => [String || Number], { nullable: true })
  userId?: number;
}
