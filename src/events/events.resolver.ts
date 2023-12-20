import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { EventsDto } from '@src/events/events.dto';
import { EventsEntity } from '@src/events/events.entity';
import { EventsFilter } from '@src/events/events.filter';
import { EventsService } from '@src/events/events.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Events')
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [EventsEntity])
  async eventsGetAll(): Promise<EventsEntity[]> {
    return await this.eventsService.eventsGetAll();
  }

  @Query(() => EventsEntity)
  async eventsGetOne(
    @Args('id')
    id: number,
  ): Promise<EventsEntity> {
    return await this.eventsService.eventsGetOne(id);
  }

  @Query(() => [EventsEntity])
  async eventsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
  ): Promise<EventsEntity[]> {
    return await this.eventsService.eventsGetMany(ids);
  }

  @Query(() => [EventsFilter])
  async eventsFilter(
    @Args('filter')
    eventsDto: EventsDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<EventsFilter[]> {
    return await this.eventsService.eventsFilter(eventsDto, optionsDto);
  }

  @Query(() => [EventsFilter])
  async eventsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<EventsFilter[]> {
    return await this.eventsService.eventsSearch(searchDto, optionsDto);
  }

  @Mutation(() => EventsEntity)
  async eventsCreate(
    @Args('create')
    eventsDto: EventsDto,
  ): Promise<EventsEntity> {
    return await this.eventsService.eventsCreate(eventsDto);
  }

  @Mutation(() => EventsEntity)
  async eventsUpdate(
    @Args('update')
    eventsDto: EventsDto,
  ): Promise<EventsEntity> {
    return await this.eventsService.eventsUpdate(eventsDto);
  }

  @Mutation(() => Number)
  async eventsRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.eventsService.eventsRemove(id);
  }
}
