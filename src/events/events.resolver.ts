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
  async eventsGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<EventsEntity[]> {
    return await this.eventsService.eventsGetAll(relations);
  }

  @Query(() => EventsEntity)
  async eventsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<EventsEntity> {
    return await this.eventsService.eventsGetOne(id, relations);
  }

  @Query(() => [EventsEntity])
  async eventsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<EventsEntity[]> {
    return await this.eventsService.eventsGetMany(ids, relations);
  }

  @Query(() => [EventsFilter])
  async eventsFilter(
    @Args('filter')
    eventsDto: EventsDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<EventsFilter[]> {
    return await this.eventsService.eventsFilter(
      eventsDto,
      optionsDto,
      relations,
    );
  }

  @Query(() => [EventsFilter])
  async eventsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<EventsFilter[]> {
    return await this.eventsService.eventsSearch(
      searchDto,
      optionsDto,
      relations,
    );
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
