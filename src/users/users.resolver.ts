import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersGroup } from '@src/users/users.group';
import { UsersService } from '@src/users/users.service';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UsersEntity])
  async usersGetAll(): Promise<UsersEntity[]> {
    return await this.usersService.usersGetAll();
  }

  @Query(() => UsersEntity)
  async usersGetOne(
    @Args('id')
    id: number,
  ): Promise<UsersEntity> {
    return await this.usersService.usersGetOne(id);
  }

  @Query(() => [UsersEntity])
  async usersGetMany(
    @Args('ids')
    getMany: GetManyDto,
  ): Promise<UsersEntity[]> {
    return await this.usersService.usersGetMany(getMany);
  }

  @Query(() => UsersEntity)
  async usersGetByAuthId(
    @Args('authId')
    authId: number,
  ): Promise<UsersEntity> {
    return await this.usersService.usersGetByAuthId(authId);
  }

  @Query(() => [UsersEntity])
  async usersFind(
    @Args('find')
    usersDto: UsersDto,
    @Args('options')
    findDto?: FindDto,
  ): Promise<UsersEntity[]> {
    return await this.usersService.usersFind(usersDto, findDto);
  }

  @Query(() => [UsersEntity])
  async usersFindIn(
    @Args('find')
    findInDto: FindInDto,
  ): Promise<UsersEntity[]> {
    return await this.usersService.usersFindIn(findInDto);
  }

  @Query(() => UsersEntity)
  async usersFindLastBy(
    @Args('find')
    usersDto: UsersDto,
  ): Promise<UsersEntity> {
    return await this.usersService.usersFindLastBy(usersDto);
  }

  @Query(() => [UsersGroup])
  async usersGroup(
    @Args('group')
    groupDto: GroupDto,
    @Args('where')
    usersDto?: UsersDto,
  ): Promise<UsersGroup[]> {
    return await this.usersService.usersGroup(
      groupDto,
      usersDto,
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
