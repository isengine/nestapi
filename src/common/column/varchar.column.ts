import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IndexedColumn } from './indexed.column';

class VarcharColumnTransformer {
  clearMatch;

  constructor(clear) {
    this.clearMatch = new RegExp(`${clear || ''}`, 'giu');
  }

  to(data: string): string {
    data = `${data || ''}`.replace(this.clearMatch, '');
    return data;
  }
  from(data: string): string {
    return `${data || ''}`;
  }
}

const lengths = {
  tiny: 15,
  medium: 1023,
  long: 2047,
};

export function VarcharColumn(
  name,
  length: number | string = 255,
  options = undefined,
): PropertyDecorator {
  const {
    comment = undefined,
    index = undefined,
    clear = undefined,
  } = options || {};

  if (typeof length === 'string') {
    length = lengths[length] || 255;
  }

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    let transformer;
    if (clear) {
      transformer = new VarcharColumnTransformer(clear);
    }

    Field({ nullable: true })(object, propertyName);

    Column({
      comment,
      default: '',
      name,
      nullable: true,
      length,
      transformer,
      type: 'varchar',
    })(object, propertyName);
  };
}
