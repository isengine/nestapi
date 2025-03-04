import { Field } from '@nestjs/graphql';
import { UpdateDateColumn } from 'typeorm';
import { IndexedColumn } from './indexed.column';

export function UpdatedColumn(
  name = 'updated_at',
  options = undefined,
): PropertyDecorator {
  const { comment = undefined, index = undefined } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    Field({ defaultValue: () => 'CURRENT_TIMESTAMP', nullable: true })(
      object,
      propertyName,
    );

    UpdateDateColumn({
      comment,
      name,
    })(object, propertyName);
  };
}
