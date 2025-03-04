import { Args, Mutation } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { CommonResolver } from '@src/common/common.resolver';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { CommonEntity } from '@src/common/common.entity';
import { CommonDto } from '@src/common/common.dto';
import { BindDto } from '../dto/bind.dto';

export const ProtectedResolver = <T extends Type<unknown>>(
  name: string,
  classDto,
  classEntity: T,
  authTable = '',
) => {
  class BaseProtectedResolver<
    Dto extends ProtectedDto | CommonDto,
    Entity extends ProtectedEntity | CommonEntity,
    Service extends CommonService<Dto, Entity>,
  > extends CommonResolver(name, classDto, classEntity)<Dto, Entity, Service> {
    readonly service: Service;

    @Auth('gql')
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
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.create(dto, relations, bind);
    }

    @Auth('gql')
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
      @Self('gql')
      auth: AuthDto,
    ): Promise<Entity> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.update(id, dto, relations, bind);
    }

    @Auth('gql')
    @Mutation(() => Number, { name: `${name}Remove` })
    async remove(
      @Args('id')
      id: number,
      @Self('gql')
      auth: AuthDto,
    ): Promise<boolean> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.remove(id, bind);
    }
  }
  return BaseProtectedResolver;
};
