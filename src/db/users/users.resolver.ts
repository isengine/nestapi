import { Resolver } from '@nestjs/graphql';
import { PrivateResolver } from '@src/common/resolver/private.resolver';
import { UsersDto } from './users.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Resolver(UsersEntity)
export class UsersResolver extends PrivateResolver(
  'users',
  UsersDto,
  UsersEntity,
)<UsersDto, UsersEntity, UsersService> {
  constructor(readonly service: UsersService) {
    super();
  }
}
