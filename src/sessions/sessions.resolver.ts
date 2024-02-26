import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SessionsDto } from '@src/sessions/sessions.dto';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { SessionsService } from '@src/sessions/sessions.service';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';

@Resolver('sessions')
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Query(() => [SessionsEntity])
  async sessionsGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SessionsEntity[]> {
    return await this.sessionsService.sessionsGetAll(relationsDto);
  }

  @Query(() => SessionsEntity)
  async sessionsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SessionsEntity> {
    return await this.sessionsService.sessionsGetOne(id, relationsDto);
  }

  @Query(() => [SessionsEntity])
  async sessionsGetByAuthId(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<SessionsEntity[]> {
    return await this.sessionsService.sessionsGetByAuthId(id, relationsDto);
  }

  @Mutation(() => SessionsEntity)
  async sessionsCreate(
    @Args('create')
    sessionsDto: SessionsDto,
  ): Promise<SessionsEntity> {
    return await this.sessionsService.sessionsCreate(sessionsDto);
  }

  @Mutation(() => SessionsEntity)
  async sessionsUpdate(
    @Args('update')
    sessionsDto: SessionsDto,
  ): Promise<SessionsEntity> {
    return await this.sessionsService.sessionsUpdate(sessionsDto);
  }

  @Mutation(() => Number)
  async sessionsRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.sessionsService.sessionsRemove(id);
  }
}
