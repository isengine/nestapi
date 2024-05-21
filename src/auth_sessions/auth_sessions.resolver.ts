import { Args, Resolver, Query } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/common.resolver';
import { AuthSessionsDto } from '@src/auth_sessions/auth_sessions.dto';
import { AuthSessionsEntity } from '@src/auth_sessions/auth_sessions.entity';
import { AuthSessionsService } from '@src/auth_sessions/auth_sessions.service';
import { AuthSessionsFilter } from '@src/auth_sessions/auth_sessions.filter';
import { RelationsDto } from '@src/common/dto/relations.dto';

@Resolver(AuthSessionsEntity)
export class AuthSessionsResolver extends CommonResolver(
  'authSessions',
  AuthSessionsEntity,
  AuthSessionsDto,
  AuthSessionsFilter,
)<
  AuthSessionsService,
  AuthSessionsEntity,
  AuthSessionsDto,
  AuthSessionsFilter
> {
  constructor(
    readonly service: AuthSessionsService,
  ) {
    super();
  }

  @Query(() => [AuthSessionsEntity])
  async getByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<AuthSessionsEntity[]> {
    return await this.service.getByAuthId(id, relationsDto);
  }
}
