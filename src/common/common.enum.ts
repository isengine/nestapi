import { registerEnumType } from '@nestjs/graphql';

export enum TypeClients {
  DEFAULT = 'public',
  CONFIDENTIAL = 'confidential',
}

registerEnumType(TypeClients, {
  name: 'TypeClients',
});

export enum TypeGenders {
  DEFAULT = '',
  MAN = 'm',
  WOMAN = 'w',
}

registerEnumType(TypeGenders, {
  name: 'TypeGenders',
});

export enum TypeGrants {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  KEY = 'key',
}

export enum TypeResponses {
  TOKEN = 'token',
  CODE = 'code',
}

export enum TypeValues {
  DEFAULT = '',
  BOOLEAN = 'boolean',
  JSON = 'json',
  NUMBER = 'number',
  STRING = 'string',
}

registerEnumType(TypeValues, {
  name: 'TypeValues',
});
