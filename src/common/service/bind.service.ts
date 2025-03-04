import { BindDto } from '../dto/bind.dto';

export function bind(entrie, { allow, key, name }: BindDto): BindDto {
  const bind = {
    allow,
    id: entrie?.[key || 'id'],
    key: key || 'id',
    name: name || 'auth',
  };
  return bind;
}
