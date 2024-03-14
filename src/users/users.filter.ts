import { ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '@src/users/users.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class UsersFilter extends FilterType(UsersEntity) {}
