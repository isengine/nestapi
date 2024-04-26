import { Args, Mutation, Query } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { ProtectedService } from '@src/common/service/protected.service';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Auth, Self } from '@src/auth/auth.decorator';
import { CommonResolver } from '@src/common/resolver/common.resolver';

export const ProtectedResolver = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  classFilter,
) => {
  class BaseProtectedResolver<
    Service extends ProtectedService<Entity, Dto, Filter>,
    Entity extends ProtectedEntity,
    Dto extends ProtectedDto,
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
    readonly protectedService: Service;

    @Auth('gql')
    @Mutation(() => classEntity, { name: `${name}Create` })
    async create(
      @Args('create', { type: () => classDto })
      dto: Dto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      authId: number,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto, authId);
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
      authId: number,
    ): Promise<Entity> {
      return await this.service.update(id, dto, relationsDto, authId);
    }

    @Auth('gql')
    @Mutation(() => Number, { name: `${name}Remove` })
    async remove(
      @Args('id')
      id: number,
      @Self('gql')
      authId: number,
    ): Promise<boolean> {
      return await this.service.remove(id, authId);
    }
  }
  return BaseProtectedResolver;
}
