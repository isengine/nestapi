import { registerEnumType } from '@nestjs/graphql';

export enum AuthRolesTypes {
  DEFAULT = '',
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}

registerEnumType(AuthRolesTypes, {
  name: 'AuthRolesTypes',
});
