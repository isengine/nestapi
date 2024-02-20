import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesEntity } from '@src/roles/roles.entity';
import { RolesService } from '@src/roles/roles.service';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';

@Resolver('roles')
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [RolesEntity])
  async rolesGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<RolesEntity[]> {
    return await this.rolesService.rolesGetAll(relationsDto);
  }

  @Query(() => RolesEntity)
  async rolesGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<RolesEntity> {
    return await this.rolesService.rolesGetOne(id, relationsDto);
  }

  @Query(() => [RolesEntity])
  async rolesGetByUserId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<RolesEntity[]> {
    return await this.rolesService.rolesGetByUserId(id, relationsDto);
  }

  @Mutation(() => RolesEntity)
  async rolesCreate(
    @Args('create')
    rolesDto: RolesDto,
  ): Promise<RolesEntity> {
    return await this.rolesService.rolesCreate(rolesDto);
  }

  @Mutation(() => RolesEntity)
  async rolesUpdate(
    @Args('update')
    rolesDto: RolesDto,
  ): Promise<RolesEntity> {
    return await this.rolesService.rolesUpdate(rolesDto);
  }

  @Mutation(() => Number)
  async rolesRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.rolesService.rolesRemove(id);
  }
}
