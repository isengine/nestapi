import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';
import { UsersService } from '@src/users/users.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { CommonResolver } from '@src/common/common.resolver';

@Resolver(UsersEntity)
export class UsersResolver extends CommonResolver(
  'users',
  UsersEntity,
  UsersDto,
  UsersFilter,
)<
  UsersService,
  UsersEntity,
  UsersDto,
  UsersFilter
> {
  constructor(
    readonly service: UsersService,
  ) {
    super();
  }

  @Query(() => UsersEntity)
  async usersFindByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity> {
    return await this.service.findByAuthId(id, relationsDto);
  }

  @Query(() => UsersEntity)
  @Auth('gql')
  async usersFindSelf(
    @Self('gql')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity> {
    return await this.service.findByAuthId(id, relationsDto);
  }

  @Mutation(() => UsersEntity)
  async usersUpdateByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<UsersEntity> {
    return await this.service.findByAuthId(id, relationsDto);
  }

  @Mutation(() => Number)
  async usersRemoveByAuthId(
    @Args('authId')
    authId: number,
  ): Promise<boolean> {
    return await this.service.removeByAuthId(authId);
  }
}
