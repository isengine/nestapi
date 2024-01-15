import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesEntity } from '@src/roles/roles.entity';
import { RolesService } from '@src/roles/roles.service';

@Resolver('roles')
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [RolesEntity])
  async rolesGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RolesEntity[]> {
    return await this.rolesService.rolesGetAll(relations);
  }

  @Query(() => RolesEntity)
  async rolesGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RolesEntity> {
    return await this.rolesService.rolesGetOne(id, relations);
  }

  @Query(() => [RolesEntity])
  async rolesGetByUserId(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<RolesEntity[]> {
    return await this.rolesService.rolesGetByUserId(id, relations);
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
