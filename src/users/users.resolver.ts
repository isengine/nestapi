import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';
import { UsersService } from '@src/users/users.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UsersEntity])
  async usersGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<UsersEntity[]> {
    return await this.usersService.usersGetAll(relations);
  }

  @Query(() => UsersEntity)
  async usersGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<UsersEntity> {
    return await this.usersService.usersGetOne(id, relations);
  }

  @Query(() => [UsersEntity])
  async usersGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<UsersEntity[]> {
    return await this.usersService.usersGetMany(ids, relations);
  }

  @Query(() => UsersEntity)
  async usersGetByAuthId(
    @Args('authId')
    authId: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<UsersEntity> {
    return await this.usersService.usersGetByAuthId(authId, relations);
  }

  @Query(() => [UsersFilter])
  async usersFilter(
    @Args('filter')
    usersDto: UsersDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<UsersFilter[]> {
    return await this.usersService.usersFilter(usersDto, optionsDto, relations);
  }

  @Query(() => [UsersFilter])
  async usersSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<UsersFilter[]> {
    return await this.usersService.usersSearch(
      searchDto,
      optionsDto,
      relations,
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
