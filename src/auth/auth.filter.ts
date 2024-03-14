import { ObjectType } from '@nestjs/graphql';
import { AuthEntity } from '@src/auth/auth.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class AuthFilter extends FilterType(AuthEntity) {}
