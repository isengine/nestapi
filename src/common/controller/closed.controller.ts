import {
  Body,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Type,
  ForbiddenException,
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { CommonController } from '@src/common/common.controller';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Doc } from '@src/common/common.decorator';

export const ClosedController = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
) => {
  class BaseClosedController<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends ClosedEntity,
    Dto extends ClosedDto,
    Filter
  > extends CommonController(
    name,
    classEntity,
    classDto,
  )<
    Service,
    Entity,
    Dto,
    Filter
  > {
    readonly service: Service;

    @Auth()
    @Post('create')
    @Doc('create', classDto)
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.create(dto, relationsDto);
    }

    @Auth()
    @Patch('update/:id')
    @Doc('update', classDto)
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body('update') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      const result = await this.service.update(Number(id), dto, relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Auth()
    @Delete('remove/:id')
    @Doc('remove', undefined)
    async remove(
      @Param('id', ParseIntPipe) id: number,
      @Self() auth: AuthDto,
    ): Promise<boolean> {
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.remove(id);
    }
  }
  return BaseClosedController;
}
