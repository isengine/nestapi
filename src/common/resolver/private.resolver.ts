import { Args, Query } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { PrivateDto } from '@src/common/dto/private.dto';
import { PrivateEntity } from '@src/common/entity/private.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { CommonEntity } from '@src/common/common.entity';
import { CommonDto } from '@src/common/common.dto';
import { BindDto } from '../dto/bind.dto';

export const PrivateResolver = <T extends Type<unknown>>(
  name: string,
  classDto,
  classEntity: T,
  authTable = '',
) => {
  class BasePrivateResolver<
    Dto extends PrivateDto | CommonDto,
    Entity extends PrivateEntity | CommonEntity,
    Service extends CommonService<Dto, Entity>,
  > extends ProtectedResolver(name, classDto, classEntity)<
    Dto,
    Entity,
    Service
  > {
    readonly service: Service;

    @Auth('gql')
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
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.find(
        {
          where,
          order,
          relations,
        },
        bind,
      );
    }

    @Auth('gql')
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
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.findOne({ id, relations }, bind);
    }

    @Auth('gql')
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
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.findFirst(
        {
          where,
          order,
          relations,
        },
        bind,
      );
    }

    @Auth('gql')
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
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.findMany(
        {
          ids,
          relations,
        },
        bind,
      );
    }

    @Auth('gql')
    @Query(() => classEntity, { name: `${name}Self` })
    async self(
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
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity[]> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: false,
      });
      return await this.service.find(
        {
          where,
          order,
          relations,
        },
        bind,
      );
    }
  }
  return BasePrivateResolver;
};
