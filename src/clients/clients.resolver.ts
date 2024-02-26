import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsFilter } from '@src/clients/clients.filter';
import { ClientsService } from '@src/clients/clients.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Clients')
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query(() => [ClientsEntity])
  async clientsGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<ClientsEntity[]> {
    return await this.clientsService.clientsGetAll(relationsDto);
  }

  @Query(() => ClientsEntity)
  async clientsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<ClientsEntity> {
    return await this.clientsService.clientsGetOne(id, relationsDto);
  }

  @Query(() => [ClientsEntity])
  async clientsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<ClientsEntity[]> {
    return await this.clientsService.clientsGetMany(ids, relationsDto);
  }

  @Query(() => [ClientsFilter])
  async clientsFilter(
    @Args('filter')
    clientsDto: ClientsDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<ClientsFilter[]> {
    return await this.clientsService.clientsFilter(clientsDto, optionsDto, relationsDto);
  }

  @Query(() => [ClientsFilter])
  async clientsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<ClientsFilter[]> {
    return await this.clientsService.clientsSearch(
      searchDto,
      optionsDto,
      relationsDto,
    );
  }

  @Mutation(() => ClientsEntity)
  async clientsCreate(
    @Args('create')
    clientsDto: ClientsDto,
  ): Promise<ClientsEntity> {
    return await this.clientsService.clientsCreate(clientsDto);
  }

  @Mutation(() => ClientsEntity)
  async clientsUpdate(
    @Args('update')
    clientsDto: ClientsDto,
  ): Promise<ClientsEntity> {
    return await this.clientsService.clientsUpdate(clientsDto);
  }

  @Mutation(() => Number)
  async clientsRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.clientsService.clientsRemove(id);
  }
}
