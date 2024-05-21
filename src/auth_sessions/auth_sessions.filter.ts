import { ObjectType } from '@nestjs/graphql';
import { AuthSessionsEntity } from '@src/auth_sessions/auth_sessions.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class AuthSessionsFilter extends FilterType(AuthSessionsEntity) {}
