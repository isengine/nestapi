import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IndexedColumn } from './indexed.column';

export function EnumColumn(
  name,
  value,
  defaultValue = undefined,
  options = undefined,
): PropertyDecorator {
  const { comment = undefined, index = undefined } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    Field(() => value, { defaultValue, nullable: true })(object, propertyName);

    Column({
      comment,
      default: defaultValue,
      enum: value,
      name,
      nullable: true,
      type: 'enum',
    })(object, propertyName);
  };
}
