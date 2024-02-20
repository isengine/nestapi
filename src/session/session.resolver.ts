import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SessionDto } from '@src/session/session.dto';
import { SessionEntity } from '@src/session/session.entity';
import { SessionService } from '@src/session/session.service';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';

@Resolver('session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => [SessionEntity])
  async sessionGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SessionEntity[]> {
    return await this.sessionService.sessionGetAll(relationsDto);
  }

  @Query(() => SessionEntity)
  async sessionGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SessionEntity> {
    return await this.sessionService.sessionGetOne(id, relationsDto);
  }

  @Query(() => [SessionEntity])
  async sessionGetByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SessionEntity[]> {
    return await this.sessionService.sessionGetByAuthId(id, relationsDto);
  }

  @Mutation(() => SessionEntity)
  async sessionCreate(
    @Args('create')
    sessionDto: SessionDto,
  ): Promise<SessionEntity> {
    return await this.sessionService.sessionCreate(sessionDto);
  }

  @Mutation(() => SessionEntity)
  async sessionUpdate(
    @Args('update')
    sessionDto: SessionDto,
  ): Promise<SessionEntity> {
    return await this.sessionService.sessionUpdate(sessionDto);
  }

  @Mutation(() => Number)
  async sessionRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.sessionService.sessionRemove(id);
  }
}
