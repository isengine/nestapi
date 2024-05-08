import { Args, Query } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { CommonService } from '@src/common/common.service';
import { PrivateDto } from '@src/common/dto/private.dto';
import { PrivateEntity } from '@src/common/entity/private.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';

export const PrivateResolver = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  classFilter,
) => {
  class BasePrivateResolver<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends PrivateEntity,
    Dto extends PrivateDto,
    Filter
  > extends ProtectedResolver(
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
    @Query(() => [classEntity], { name: `${name}Find` })
    async find(
      @Args('where', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      where: object,
      @Args('order', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      order: object,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.find(where, order, relationsDto, authId);
    }

    @Auth('gql')
    @Query(() => classEntity, { name: `${name}FindOne` })
    async findOne(
      @Args('id')
      id: number,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.findOne(id, relationsDto, authId);
    }

    @Auth('gql')
    @Query(() => classEntity, { name: `${name}First` })
    async first(
      @Args('where', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      where: object,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.first(where, relationsDto, authId);
    }

    @Auth('gql')
    @Query(() => [classEntity], { name: `${name}Many` })
    async many(
      @Args('ids', { type: () => [Number || String] })
      ids: Array<number | string>,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.many(ids, relationsDto, authId);
    }

    @Auth('gql')
    @Query(() => [classFilter], { name: `${name}Filter` })
    async filter(
      @Args('where', { nullable: true, defaultValue: {}, type: () => classDto })
      dto: Dto,
      @Args('search', { nullable: true, defaultValue: {}, type: () => SearchDto })
      searchDto: SearchDto,
      @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
      optionsDto: OptionsDto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
      @Self('gql')
      auth: AuthDto,
    ): Promise<Filter[]> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.filter(
        dto,
        searchDto,
        optionsDto,
        relationsDto,
        authId,
      );
    }
  }
  return BasePrivateResolver;
}
