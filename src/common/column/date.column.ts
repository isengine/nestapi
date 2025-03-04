import { Field } from '@nestjs/graphql';
import { CreateDateColumn } from 'typeorm';
import { IndexedColumn } from './indexed.column';

export function DateColumn(name, options = undefined): PropertyDecorator {
  const { comment = undefined, index = undefined } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    Field({ defaultValue: () => 'NULL', nullable: true })(object, propertyName);

    CreateDateColumn({
      comment,
      default: () => 'NULL',
      name,
      nullable: true,
    })(object, propertyName);
  };
}
