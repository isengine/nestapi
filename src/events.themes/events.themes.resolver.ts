import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { EventsThemesDto } from '@src/events.themes/events.themes.dto';
import { EventsThemesEntity } from '@src/events.themes/events.themes.entity';
import { EventsThemesFilter } from '@src/events.themes/events.themes.filter';
import { EventsThemesService } from '@src/events.themes/events.themes.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('EventsThemes')
export class EventsThemesResolver {
  constructor(private readonly eventsThemesService: EventsThemesService) {}

  @Query(() => [EventsThemesEntity])
  async eventsThemesGetAll(): Promise<EventsThemesEntity[]> {
    return await this.eventsThemesService.eventsThemesGetAll();
  }

  @Query(() => EventsThemesEntity)
  async eventsThemesGetOne(
    @Args('id')
    id: number,
  ): Promise<EventsThemesEntity> {
    return await this.eventsThemesService.eventsThemesGetOne(id);
  }

  @Query(() => [EventsThemesEntity])
  async eventsThemesGetMany(
    @Args('ids')
    getMany: GetManyDto,
  ): Promise<EventsThemesEntity[]> {
    return await this.eventsThemesService.eventsThemesGetMany(getMany);
  }

  @Query(() => [EventsThemesFilter])
  async eventsThemesFilter(
    @Args('filter')
    eventsThemesDto: EventsThemesDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<EventsThemesFilter[]> {
    return await this.eventsThemesService.eventsThemesFilter(
      eventsThemesDto,
      optionsDto,
    );
  }

  @Query(() => [EventsThemesFilter])
  async eventsThemesSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<EventsThemesFilter[]> {
    return await this.eventsThemesService.eventsThemesSearch(
      searchDto,
      optionsDto,
    );
  }

  @Mutation(() => EventsThemesEntity)
  async eventsThemesCreate(
    @Args('create')
    eventsThemesDto: EventsThemesDto,
  ): Promise<EventsThemesEntity> {
    return await this.eventsThemesService.eventsThemesCreate(eventsThemesDto);
  }

  @Mutation(() => EventsThemesEntity)
  async eventsThemesUpdate(
    @Args('update')
    eventsThemesDto: EventsThemesDto,
  ): Promise<EventsThemesEntity> {
    return await this.eventsThemesService.eventsThemesUpdate(eventsThemesDto);
  }

  @Mutation(() => Number)
  async eventsThemesRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.eventsThemesService.eventsThemesRemove(id);
  }
}
