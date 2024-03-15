import { Args, Mutation, Query } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { CommonService } from '@src/common/service/common.service';
import { CommonDto } from '@src/common/dto/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { GraphQLJSONObject } from 'graphql-type-json';

export const CommonResolver = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  classFilter,
) => {
  class BaseResolver<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends CommonEntity,
    Dto extends CommonDto,
    Filter
  > {
    readonly service: Service;

    @Query(() => [classEntity], { name: `${name}Find` })
    async find(
      @Args('where', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      where: object,
      @Args('order', { nullable: true, defaultValue: undefined, type: () => GraphQLJSONObject })
      order: object,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
    ): Promise<Entity[]> {
      return await this.service.find(where, order, relationsDto);
    }

    @Query(() => classEntity, { name: `${name}FindOne` })
    async findOne(
      @Args('id')
      id: number,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      return await this.service.findOne(id, relationsDto);
    }

    @Query(() => [classEntity], { name: `${name}FindMany` })
    async findMany(
      @Args('ids', { type: () => [Number || String] })
      ids: Array<number | string>,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
    ): Promise<Entity[]> {
      return await this.service.findMany(ids, relationsDto);
    }

    @Query(() => [classFilter], { name: `${name}Filter` })
    async filter(
      @Args('filter', { type: () => classDto })
      dto: Dto,
      @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
      optionsDto: OptionsDto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
    ): Promise<Filter[]> {
      return await this.service.filter(dto, optionsDto, relationsDto);
    }

    @Query(() => [classFilter], { name: `${name}Search` })
    async search(
      @Args('search', { type: () => classDto })
      searchDto: SearchDto,
      @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
      optionsDto: OptionsDto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
    ): Promise<Filter[]> {
      return await this.service.search(
        searchDto,
        optionsDto,
        relationsDto,
      );
    }

    @Mutation(() => classEntity, { name: `${name}Create` })
    async create(
      @Args('create', { type: () => classDto })
      dto: Dto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto);
    }

    @Mutation(() => classEntity, { name: `${name}Update` })
    async update(
      @Args('update', { type: () => classDto })
      dto: Dto,
      @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
      relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      return await this.service.update(dto, relationsDto);
    }

    @Mutation(() => Number, { name: `${name}Remove` })
    async remove(
      @Args('id') id: number,
    ): Promise<boolean> {
      return await this.service.remove(id);
    }
  }
  return BaseResolver;
}
