import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';
import { UsersService } from '@src/users/users.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Auth, Self } from '@src/auth/auth.decorator';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UsersEntity])
  async usersGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity[]> {
    return await this.usersService.usersGetAll(relationsDto);
  }

  @Query(() => UsersEntity)
  async usersGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity> {
    return await this.usersService.usersGetOne(id, relationsDto);
  }

  @Query(() => [UsersEntity])
  async usersGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity[]> {
    return await this.usersService.usersGetMany(ids, relationsDto);
  }

  @Query(() => UsersEntity)
  async usersGetByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity> {
    return await this.usersService.usersGetByAuthId(id, relationsDto);
  }

  @Query(() => UsersEntity)
  @Auth('gql')
  async usersGetSelf(
    @Self('gql')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity> {
    return await this.usersService.usersGetByAuthId(id, relationsDto);
  }

  @Query(() => [UsersFilter])
  async usersFilter(
    @Args('filter')
    usersDto: UsersDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersFilter[]> {
    return await this.usersService.usersFilter(usersDto, optionsDto, relationsDto);
  }

  @Query(() => [UsersFilter])
  async usersSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersFilter[]> {
    return await this.usersService.usersSearch(
      searchDto,
      optionsDto,
      relationsDto,
    );
  }

  @Mutation(() => UsersEntity)
  async usersCreate(
    @Args('create')
    usersDto: UsersDto,
  ): Promise<UsersEntity> {
    return await this.usersService.usersCreate(usersDto);
  }

  @Mutation(() => UsersEntity)
  async usersUpdate(
    @Args('update')
    usersDto: UsersDto,
  ): Promise<UsersEntity> {
    return await this.usersService.usersUpdate(usersDto);
  }

  @Mutation(() => UsersEntity)
  async usersUpdateByAuthId(
    @Args('update')
    usersDto: UsersDto,
  ): Promise<UsersEntity> {
    return await this.usersService.usersUpdateByAuthId(usersDto);
  }

  @Mutation(() => Number)
  async usersRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.usersService.usersRemove(id);
  }

  @Mutation(() => Number)
  async usersRemoveByAuthId(
    @Args('authId')
    authId: number,
  ): Promise<boolean> {
    return await this.usersService.usersRemoveByAuthId(authId);
  }
}
