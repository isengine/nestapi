import { Field } from '@nestjs/graphql';
import { Column, DeepPartial } from 'typeorm';
import { IndexedColumn } from './indexed.column';

class BigIntColumnTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseInt(data);
  }
}

export function BigIntColumn(
  name,
  value = 0,
  options = undefined,
): PropertyDecorator {
  const {
    comment = undefined,
    index = undefined,
    nullable = undefined,
    unsigned = undefined,
    width = undefined,
  } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    Field({ nullable: true })(object, propertyName);

    const props: DeepPartial<any> = {
      comment,
      default: +value || 0,
      name,
      transformer: new BigIntColumnTransformer(),
      type: 'bigint',
    };

    if (nullable) {
      props.nullable = true;
    }

    if (width) {
      props.width = width;
    }

    if (unsigned) {
      props.unsigned = true;
    }

    Column(props)(object, propertyName);
  };
}
