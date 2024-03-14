import { ObjectType } from '@nestjs/graphql';
import { RolesEntity } from '@src/roles/roles.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class RolesFilter extends FilterType(RolesEntity) {}
