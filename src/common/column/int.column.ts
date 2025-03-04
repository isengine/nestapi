import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IndexedColumn } from './indexed.column';

class IntColumnTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseInt(data);
  }
}

export function IntColumn(
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
      transformer: new IntColumnTransformer(),
      type: 'int',
    })(object, propertyName);
  };
}
