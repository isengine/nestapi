import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';
import { SocketsService } from '@src/sockets/sockets.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Sockets')
export class SocketsResolver {
  constructor(private readonly socketsService: SocketsService) {}

  @Query(() => [SocketsEntity])
  async socketsGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SocketsEntity[]> {
    return await this.socketsService.socketsGetAll(relations);
  }

  @Query(() => SocketsEntity)
  async socketsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SocketsEntity> {
    return await this.socketsService.socketsGetOne(id, relations);
  }

  @Query(() => [SocketsEntity])
  async socketsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SocketsEntity[]> {
    return await this.socketsService.socketsGetMany(ids, relations);
  }

  @Query(() => [SocketsFilter])
  async socketsFilter(
    @Args('filter')
    socketsDto: SocketsDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SocketsFilter[]> {
    return await this.socketsService.socketsFilter(
      socketsDto,
      optionsDto,
      relations,
    );
  }

  @Query(() => [SocketsFilter])
  async socketsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SocketsFilter[]> {
    return await this.socketsService.socketsSearch(
      searchDto,
      optionsDto,
      relations,
    );
  }

  @Mutation(() => SocketsEntity)
  async socketsCreate(
    @Args('create')
    socketsDto: SocketsDto,
  ): Promise<SocketsEntity> {
    return await this.socketsService.socketsCreate(socketsDto);
  }

  @Mutation(() => SocketsEntity)
  async socketsUpdate(
    @Args('update')
    socketsDto: SocketsDto,
  ): Promise<SocketsEntity> {
    return await this.socketsService.socketsUpdate(socketsDto);
  }

  @Mutation(() => Number)
  async socketsRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.socketsService.socketsRemove(id);
  }
}
