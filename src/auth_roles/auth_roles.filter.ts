import { ObjectType } from '@nestjs/graphql';
import { AuthRolesEntity } from '@src/auth_roles/auth_roles.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class AuthRolesFilter extends FilterType(AuthRolesEntity) {}
