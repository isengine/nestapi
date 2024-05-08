import { Args, Mutation } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { CommonResolver } from '@src/common/common.resolver';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';

export const ProtectedResolver = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  classFilter,
) => {
  class BaseProtectedResolver<
    Service extends CommonService<Entity, Dto, Filter>,
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
      const authId = auth.id;
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
      auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.update(id, dto, relationsDto, authId);
    }

    @Auth('gql')
    @Mutation(() => Number, { name: `${name}Remove` })
    async remove(
      @Args('id')
      id: number,
      @Self('gql')
      auth: AuthDto,
    ): Promise<boolean> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.remove(id, authId);
    }
  }
  return BaseProtectedResolver;
}
