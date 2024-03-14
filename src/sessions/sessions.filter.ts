import { ObjectType } from '@nestjs/graphql';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class SessionsFilter extends FilterType(SessionsEntity) {}
