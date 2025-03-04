import { Args, Mutation, Query } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AuthDto } from '@src/auth/auth.dto';

export const CommonResolver = <T extends Type<unknown>>(
  name: string,
  classDto,
  classEntity: T,
) => {
  class BaseResolver<
    Dto extends CommonDto,
    Entity extends CommonEntity,
    Service extends CommonService<Dto, Entity>,
  > {
    readonly service: Service;

    @Query(() => [classEntity], { name: `${name}Find` })
    async find(
      @Args('where', {
        nullable: true,
        defaultValue: undefined,
        type: () => GraphQLJSONObject,
      })
      where: object,
      @Args('order', {
        nullable: true,
        defaultValue: undefined,
        type: () => GraphQLJSONObject,
      })
      order: object,
      @Args('relations', {
        nullable: true,
        defaultValue: [],
        type: () => [RelationsDto],
      })
      relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity[]> {
      return await this.service.find({ where, order, relations });
    }

    @Query(() => classEntity, { name: `${name}FindOne` })
    async findOne(
      @Args('id')
      id: number,
      @Args('relations', {
        nullable: true,
        defaultValue: [],
        type: () => [RelationsDto],
      })
      relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.findOne({ id, relations });
    }

    @Query(() => classEntity, { name: `${name}FindFirst` })
    async findFirst(
      @Args('where', {
        nullable: true,
        defaultValue: undefined,
        type: () => GraphQLJSONObject,
      })
      where: object,
      @Args('order', {
        nullable: true,
        defaultValue: undefined,
        type: () => GraphQLJSONObject,
      })
      order: object,
      @Args('relations', {
        nullable: true,
        defaultValue: [],
        type: () => [RelationsDto],
      })
      relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.findFirst({ where, order, relations });
    }

    @Query(() => [classEntity], { name: `${name}FindMany` })
    async findMany(
      @Args('ids', { type: () => [Number || String] })
      ids: Array<number | string>,
      @Args('relations', {
        nullable: true,
        defaultValue: [],
        type: () => [RelationsDto],
      })
      relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity[]> {
      return await this.service.findMany({ ids, relations });
    }

    @Mutation(() => classEntity, { name: `${name}Create` })
    async create(
      @Args('create', { type: () => classDto })
      dto: Dto,
      @Args('relations', {
        nullable: true,
        defaultValue: [],
        type: () => [RelationsDto],
      })
      relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.create(dto, relations);
    }

    @Mutation(() => classEntity, { name: `${name}Update` })
    async update(
      @Args('id')
      id: number,
      @Args('update', { type: () => classDto })
      dto: Dto,
      @Args('relations', {
        nullable: true,
        defaultValue: [],
        type: () => [RelationsDto],
      })
      relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.update(id, dto, relations);
    }

    @Mutation(() => Number, { name: `${name}Remove` })
    async remove(
      @Args('id') id: number,
      auth: AuthDto = undefined,
    ): Promise<boolean> {
      return await this.service.remove(id);
    }
  }
  return BaseResolver;
};
