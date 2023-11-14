import { ObjectType } from '@nestjs/graphql';
import { EventsThemesEntity } from '@src/events.themes/events.themes.entity';
import { FilterType } from '@src/typeorm/types/filter.type';

@ObjectType()
export class EventsThemesFilter extends FilterType(EventsThemesEntity) {}
