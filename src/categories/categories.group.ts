import { Field, ObjectType } from '@nestjs/graphql';
import { CategoriesEntity } from '@src/categories/categories.entity';

@ObjectType()
export class CategoriesGroup {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [CategoriesEntity], { nullable: true })
  children?: CategoriesEntity[];
}
