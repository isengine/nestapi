import { Args, Resolver, Query } from '@nestjs/graphql';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesEntity } from '@src/roles/roles.entity';
import { RolesService } from '@src/roles/roles.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { RolesFilter } from '@src/roles/roles.filter';

@Resolver(RolesEntity)
export class RolesResolver extends ProtectedResolver(
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
  async rolesGetByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<RolesEntity[]> {
    return await this.service.rolesGetByAuthId(id, relationsDto);
  }
}
