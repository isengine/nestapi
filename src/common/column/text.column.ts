import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IndexedColumn } from './indexed.column';

class TextColumnTransformer {
  to(data: string): string | null {
    return data ? `${data}` : null;
  }
  from(data: string): string {
    return `${data || ''}`;
  }
}

export function TextColumn(name, options = undefined): PropertyDecorator {
  const { comment = undefined, index = undefined } = options || {};

  return function (object: object, propertyName: string) {
    if (index) {
      IndexedColumn(index)(object, propertyName);
    }

    Field({ nullable: true })(object, propertyName);

    Column({
      comment,
      default: null,
      name,
      nullable: true,
      transformer: new TextColumnTransformer(),
      type: 'text',
    })(object, propertyName);
  };
}
