import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { RoomsFilter } from '@src/rooms/rooms.filter';
import { RoomsService } from '@src/rooms/rooms.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('rooms')
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Query(() => [RoomsEntity])
  async roomsGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RoomsEntity[]> {
    return await this.roomsService.roomsGetAll(relations);
  }

  @Query(() => RoomsEntity)
  async roomsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RoomsEntity> {
    return await this.roomsService.roomsGetOne(id, relations);
  }

  @Query(() => [RoomsEntity])
  async roomsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RoomsEntity[]> {
    return await this.roomsService.roomsGetMany(ids, relations);
  }

  @Query(() => [RoomsFilter])
  async roomsFilter(
    @Args('filter')
    roomsDto: RoomsDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RoomsFilter[]> {
    return await this.roomsService.roomsFilter(roomsDto, optionsDto, relations);
  }

  @Query(() => [RoomsFilter])
  async roomsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RoomsFilter[]> {
    return await this.roomsService.roomsSearch(
      searchDto,
      optionsDto,
      relations,
    );
  }

  @Mutation(() => RoomsEntity)
  async roomsCreate(
    @Args('create')
    roomsDto: RoomsDto,
  ): Promise<RoomsEntity> {
    return await this.roomsService.roomsCreate(roomsDto);
  }

  @Mutation(() => RoomsEntity)
  async roomsUpdate(
    @Args('update')
    roomsDto: RoomsDto,
  ): Promise<RoomsEntity> {
    return await this.roomsService.roomsUpdate(roomsDto);
  }

  @Mutation(() => Number)
  async roomsRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.roomsService.roomsRemove(id);
  }
}
