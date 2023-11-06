import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function FilterType<T>(ItemType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class FilterResult {
    @Field({ nullable: true })
    count?: number;

    @Field({ nullable: true })
    pages?: number;

    @Field({ nullable: true })
    group?: string;

    @Field(() => [ItemType], { nullable: true })
    list?: T[];
  }
  return FilterResult;
}
