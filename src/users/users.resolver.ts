import { Resolver } from '@nestjs/graphql';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';
import { UsersService } from '@src/users/users.service';
import { PrivateResolver } from '@src/common/resolver/private.resolver';

@Resolver(UsersEntity)
export class UsersResolver extends PrivateResolver(
  'users',
  UsersEntity,
  UsersDto,
  UsersFilter,
)<
  UsersService,
  UsersEntity,
  UsersDto,
  UsersFilter
> {
  constructor(
    readonly service: UsersService,
  ) {
    super();
  }
}
