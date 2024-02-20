import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';
import { SocketsService } from '@src/sockets/sockets.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Sockets')
export class SocketsResolver {
  constructor(private readonly socketsService: SocketsService) {}

  @Query(() => [SocketsEntity])
  async socketsGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SocketsEntity[]> {
    return await this.socketsService.socketsGetAll(relationsDto);
  }

  @Query(() => SocketsEntity)
  async socketsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SocketsEntity> {
    return await this.socketsService.socketsGetOne(id, relationsDto);
  }

  @Query(() => [SocketsEntity])
  async socketsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SocketsEntity[]> {
    return await this.socketsService.socketsGetMany(ids, relationsDto);
  }

  @Query(() => [SocketsFilter])
  async socketsFilter(
    @Args('filter')
    socketsDto: SocketsDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SocketsFilter[]> {
    return await this.socketsService.socketsFilter(
      socketsDto,
      optionsDto,
      relationsDto,
    );
  }

  @Query(() => [SocketsFilter])
  async socketsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SocketsFilter[]> {
    return await this.socketsService.socketsSearch(
      searchDto,
      optionsDto,
      relationsDto,
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
