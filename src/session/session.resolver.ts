import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SessionDto } from '@src/session/session.dto';
import { SessionEntity } from '@src/session/session.entity';
import { SessionService } from '@src/session/session.service';

@Resolver('session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => [SessionEntity])
  async sessionGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SessionEntity[]> {
    return await this.sessionService.sessionGetAll(relations);
  }

  @Query(() => SessionEntity)
  async sessionGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SessionEntity> {
    return await this.sessionService.sessionGetOne(id, relations);
  }

  @Query(() => [SessionEntity])
  async sessionGetByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<SessionEntity[]> {
    return await this.sessionService.sessionGetByAuthId(id, relations);
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
