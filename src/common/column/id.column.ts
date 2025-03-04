import { Field, ID } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

type IdTypes = 'int' | 'bigint';

export function IdColumn(
  type: IdTypes = 'bigint',
  comment = undefined,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    Field(() => ID, { nullable: true })(object, propertyName);

    PrimaryGeneratedColumn({
      comment,
      name: 'id',
      type,
      unsigned: true,
    })(object, propertyName);
  };
}
