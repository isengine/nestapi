import { registerEnumType } from '@nestjs/graphql';

export enum GenderUsers {
  DEFAULT = '',
  MAN = 'm',
  WOMAN = 'w',
}

registerEnumType(GenderUsers, {
  name: 'GenderUsers',
});
