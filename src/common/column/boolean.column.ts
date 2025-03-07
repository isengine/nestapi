import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IndexedColumn } from './indexed.column';

class BooleanColumnTransformer {
  to(data: any): number {
    return +data > 0 ? 1 : 0;
  }
  from(data: any): boolean {
    return Boolean(data);
  }
}

export function BooleanColumn(
  name,
  value = false,
  options = undefined,
): PropertyDecorator {
  const { comment = undefined, index = undefined } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    const defaultValue = +value || 0;

    Field({ defaultValue, nullable: true })(object, propertyName);

    Column({
      comment,
      default: defaultValue,
      name,
      transformer: new BooleanColumnTransformer(),
      type: 'smallint',
      width: 1,
    })(object, propertyName);
  };
}
