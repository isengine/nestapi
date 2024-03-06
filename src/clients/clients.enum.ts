import { registerEnumType } from '@nestjs/graphql';

export enum TypeClients {
  DEFAULT = 'public',
  CONFIDENTIAL = 'confidential',
}

registerEnumType(TypeClients, {
  name: 'TypeClients',
});

export enum ResponseTypeClients {
  TOKEN = 'token',
  CODE = 'code',
}

export enum GrantTypeClients {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
}
