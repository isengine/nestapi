import { Args, Resolver, Query } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/resolver/common.resolver';
import { SessionsDto } from '@src/sessions/sessions.dto';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { SessionsService } from '@src/sessions/sessions.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SessionsFilter } from '@src/sessions/sessions.filter';

@Resolver(SessionsEntity)
export class SessionsResolver extends CommonResolver(
  'sessions',
  SessionsEntity,
  SessionsDto,
  SessionsFilter,
)<
  SessionsService,
  SessionsEntity,
  SessionsDto,
  SessionsFilter
> {
  constructor(
    readonly service: SessionsService,
  ) {
    super();
  }

  @Query(() => [SessionsEntity])
  async sessionsGetByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SessionsEntity[]> {
    return await this.service.sessionsGetByAuthId(id, relationsDto);
  }
}
