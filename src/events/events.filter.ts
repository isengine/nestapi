import { ObjectType } from '@nestjs/graphql';
import { EventsEntity } from '@src/events/events.entity';
import { FilterType } from '@src/typeorm/types/filter.type';

@ObjectType()
export class EventsFilter extends FilterType(EventsEntity) {}
