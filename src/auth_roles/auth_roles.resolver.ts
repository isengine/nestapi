import { Args, Resolver, Query } from '@nestjs/graphql';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { AuthRolesDto } from '@src/auth_roles/auth_roles.dto';
import { AuthRolesEntity } from '@src/auth_roles/auth_roles.entity';
import { AuthRolesService } from '@src/auth_roles/auth_roles.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { AuthRolesFilter } from '@src/auth_roles/auth_roles.filter';

@Resolver(AuthRolesEntity)
export class AuthRolesResolver extends ProtectedResolver(
  'authRoles',
  AuthRolesEntity,
  AuthRolesDto,
  AuthRolesFilter,
)<
  AuthRolesService,
  AuthRolesEntity,
  AuthRolesDto,
  AuthRolesFilter
> {
  constructor(
    readonly service: AuthRolesService,
  ) {
    super();
  }

  @Query(() => [AuthRolesEntity])
  async getByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<AuthRolesEntity[]> {
    return await this.service.getByAuthId(id, relationsDto);
  }
}
