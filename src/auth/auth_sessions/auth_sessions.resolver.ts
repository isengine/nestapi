import { Args, Resolver, Query } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/common.resolver';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { AuthSessionsDto } from './auth_sessions.dto';
import { AuthSessionsEntity } from './auth_sessions.entity';
import { AuthSessionsService } from './auth_sessions.service';

@Resolver(AuthSessionsEntity)
export class AuthSessionsResolver extends CommonResolver(
  'authSessions',
  AuthSessionsDto,
  AuthSessionsEntity,
)<AuthSessionsDto, AuthSessionsEntity, AuthSessionsService> {
  constructor(readonly service: AuthSessionsService) {
    super();
  }

  @Query(() => [AuthSessionsEntity])
  async getByAuthId(
    @Args('id')
    id: number,
    @Args('relations', {
      nullable: true,
      defaultValue: [],
      type: () => [RelationsDto],
    })
    relations: Array<RelationsDto>,
  ): Promise<AuthSessionsEntity[]> {
    return await this.service.getByAuthId(id, relations);
  }
}
