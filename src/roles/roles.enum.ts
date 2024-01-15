import { registerEnumType } from '@nestjs/graphql';

export enum RolesTypes {
  DEFAULT = '',
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}

registerEnumType(RolesTypes, {
  name: 'RolesTypes',
});
