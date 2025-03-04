import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Patch,
  Type,
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data, Doc } from '@src/common/common.decorator';
import { CommonService } from '@src/common/common.service';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';

export const CommonController = <T extends Type<unknown>>(
  name: string,
  classDto,
  classEntity: T,
  authTable = '',
) => {
  @ApiTags(name)
  class BaseController<
    Dto extends CommonDto,
    Entity extends CommonEntity,
    Service extends CommonService<Dto, Entity>,
  > {
    readonly service: Service;

    @Auth('noBlock')
    @Get('find')
    @Doc('find', classDto)
    async find(
      @Data('search') search: object,
      @Data('select') select: object,
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('limit') limit: number = undefined,
      @Data('offset') offset: number = undefined,
      @Data('relations') relations: Array<RelationsDto>,
      @Self('noBlock') auth: AuthDto,
    ): Promise<Entity[]> {
      return await this.service.find({
        search,
        select,
        where,
        order,
        limit,
        offset,
        relations,
      });
    }

    @Auth('noBlock')
    @Get('find/first')
    @Doc('findFirst', classDto)
    async findFirst(
      @Data('search') search: object,
      @Data('select') select: object,
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relations: Array<RelationsDto>,
      @Self('noBlock') auth: AuthDto,
    ): Promise<Entity> {
      return await this.service.findFirst({
        search,
        select,
        where,
        order,
        relations,
      });
    }

    @Auth('noBlock')
    @Get('find/many/:ids')
    @Doc('findMany', classDto)
    async findMany(
      @Param('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
      ids: Array<number>,
      @Data('select') select: object,
      @Data('relations') relations: Array<RelationsDto>,
      @Self('noBlock') auth: AuthDto,
    ): Promise<Entity[]> {
      const result = await this.service.findMany({
        ids,
        select,
        relations,
      });
      if (!result) {
        throw new NotFoundException('Entrie not found');
      }
      return result;
    }

    @Auth('noBlock')
    @Get('find/:id')
    @Doc('findOne', classDto)
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Data('select') select: object,
      @Data('relations') relations: Array<RelationsDto>,
      @Self('noBlock') auth: AuthDto,
    ): Promise<Entity> {
      const result = await this.service.findOne({
        id: Number(id),
        select,
        relations,
      });
      if (!result) {
        throw new NotFoundException('Entrie not found');
      }
      return result;
    }

    @Auth('noBlock')
    @Get('count')
    @Doc('count', classDto)
    async count(
      @Data('where') where: object,
      @Data('limit') limit: number = undefined,
      @Data('offset') offset: number = undefined,
      @Data('relations') relations: Array<RelationsDto>,
      @Self('noBlock') auth: AuthDto,
    ): Promise<number> {
      return await this.service.count({ where, limit, offset, relations });
    }

    @Post('create')
    @Doc('create', classDto)
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.create(dto, relations);
    }

    @Patch('update/:id')
    @Doc('update', classDto)
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body('update') dto: Dto,
      @Body('relations') relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      const result = await this.service.update(Number(id), dto, relations, {
        allow: true,
      });
      if (!result) {
        throw new NotFoundException('Entrie not found');
      }
      return result;
    }

    @Delete('remove/:id')
    @Doc('remove', undefined)
    async remove(
      @Param('id', ParseIntPipe) id: number,
      auth: AuthDto = undefined,
    ): Promise<boolean> {
      return await this.service.remove(id);
    }

    @Post('position/sort')
    @Doc('sortPosition', classDto)
    async sortPosition(
      @Data('field') field: string,
      @Data('select') select: object,
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('limit') limit: number = undefined,
      @Data('offset') offset: number = undefined,
      @Data('relations') relations: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<boolean> {
      const result = await this.service.sortPosition(field, {
        select,
        where,
        order,
        limit,
        offset,
        relations,
      });
      if (!result) {
        throw new NotFoundException('Entries not found');
      }
      return result;
    }

    @Post('position/move/:id')
    @Doc('movePosition', classDto)
    async movePosition(
      @Param('id', ParseIntPipe) id: number,
      @Data('field') field: string,
      @Data('position') position: number = undefined,
      auth: AuthDto = undefined,
    ): Promise<boolean> {
      const result = await this.service.movePosition(id, field, position, {
        allow: true,
      });
      if (!result) {
        throw new NotFoundException('Entrie position has not been moved');
      }
      return result;
    }
  }
  return BaseController;
};
