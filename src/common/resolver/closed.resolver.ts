import { Args, Mutation } from '@nestjs/graphql';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { ForbiddenException, Type } from '@nestjs/common';
import { CommonService } from '@src/common/common.service';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { CommonResolver } from '@src/common/common.resolver';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';

export const ClosedResolver = <T extends Type<unknown>>(
  name: string,
  classDto,
  classEntity: T,
) => {
  class BaseClosedResolver<
    Dto extends ClosedDto,
    Entity extends ClosedEntity,
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
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.create(dto, relations);
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
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.update(id, dto, relations);
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
};
