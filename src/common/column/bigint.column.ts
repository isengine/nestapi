import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IndexedColumn } from './indexed.column';

export function BigIntColumn(
  name,
  value = 0,
  options = undefined,
): PropertyDecorator {
  const { comment = undefined, index = undefined } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    Field({ nullable: true })(object, propertyName);

    Column({
      comment,
      default: +value || 0,
      name,
      type: 'bigint',
      unsigned: true,
    })(object, propertyName);
  };
}
