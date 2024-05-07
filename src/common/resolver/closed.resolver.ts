import { Args, Mutation } from '@nestjs/graphql';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { ForbiddenException, Type } from '@nestjs/common';
import { CommonService } from '@src/common/common.service';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { CommonResolver } from '@src/common/common.resolver';
import { AuthDto } from '@src/auth/auth.dto';

export const ClosedResolver = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  classFilter,
) => {
  class BaseClosedResolver<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends ClosedEntity,
    Dto extends ClosedDto,
    Filter
  > extends CommonResolver(
    name,
    classEntity,
    classDto,
    classFilter,
  )<
    Service,
    Entity,
    Dto,
    Filter
  > {
    readonly service: Service;

    @Auth('gql')
    @Mutation(() => classEntity, { name: `${name}Create` })
    async create(
      @Args('create', { type: () => classDto })
      dto: Dto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.create(dto, relationsDto);
    }

    @Auth('gql')
    @Mutation(() => classEntity, { name: `${name}Update` })
    async update(
      @Args('id')
      id: number,
      @Args('update', { type: () => classDto })
      dto: Dto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.update(id, dto, relationsDto);
    }

    @Auth('gql')
    @Mutation(() => Number, { name: `${name}Remove` })
    async remove(
      @Args('id')
      id: number,
      @Self('gql')
      auth: AuthDto,
    ): Promise<boolean> {
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.remove(id);
    }
  }
  return BaseClosedResolver;
}
