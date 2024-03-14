import { Args, Resolver, Query } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/common.resolver';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesEntity } from '@src/roles/roles.entity';
import { RolesService } from '@src/roles/roles.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { RolesFilter } from '@src/roles/roles.filter';

@Resolver(RolesEntity)
export class RolesResolver extends CommonResolver(
  'roles',
  RolesEntity,
  RolesDto,
  RolesFilter,
)<
  RolesService,
  RolesEntity,
  RolesDto,
  RolesFilter
> {
  constructor(
    readonly service: RolesService,
  ) {
    super();
  }

  @Query(() => [RolesEntity])
  async rolesGetByUserId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<RolesEntity[]> {
    return await this.service.rolesGetByUserId(id, relationsDto);
  }
}
