import { registerEnumType } from '@nestjs/graphql';

export enum GenderPersons {
  DEFAULT = '',
  MAN = 'm',
  WOMAN = 'w',
}

registerEnumType(GenderPersons, {
  name: 'GenderPersons',
});
