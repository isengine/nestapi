import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IndexedColumn } from './indexed.column';

class FloatColumnTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

export function FloatColumn(
  name,
  value = 0,
  options = undefined,
): PropertyDecorator {
  const {
    comment = undefined,
    index = undefined,
    precision = 15,
    scale = 2,
  } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    Field({ nullable: true })(object, propertyName);

    Column({
      comment,
      default: +value || 0,
      name,
      precision: +precision || 0,
      scale: +scale || 0,
      transformer: new FloatColumnTransformer(),
      type: 'decimal',
    })(object, propertyName);
  };
}
