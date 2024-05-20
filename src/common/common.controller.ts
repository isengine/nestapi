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
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { Data, Doc } from '@src/common/common.decorator';
import { CommonService } from '@src/common/common.service';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from '@src/auth/auth.dto';

export const CommonController = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
) => {
  @ApiTags(name)
  class BaseController<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends CommonEntity,
    Dto extends CommonDto,
    Filter
  > {
    readonly service: Service;

    @Get('find')
    @Doc('find', classDto)
    async find(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity[]> {
      return await this.service.find(where, order, relationsDto);
    }

    @Get('find/:id')
    @Doc('findOne', classDto)
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      const result = await this.service.findOne(Number(id), relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('first')
    @Doc('first', classDto)
    async first(
      @Data('where') where: Object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.first(where, order, relationsDto);
    }

    @Get('many/:ids')
    @Doc('many', classDto)
    async many(
      @Param('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: Array<number>,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity[]> {
      const result = await this.service.many(ids, relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('filter')
    @Doc('filter', classDto)
    async filter(
      @Data('where') dto: Dto,
      @Data('search') searchDto: SearchDto,
      @Data('options') optionsDto: OptionsDto,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Filter[]> {
      const result = await this.service.filter(
        dto,
        searchDto,
        optionsDto,
        relationsDto,
      );
      if (!result) {
        throw new NotFoundException('Any results not found');
      }
      return result;
    }

    @Post('create')
    @Doc('create', classDto)
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto);
    }

    @Patch('update/:id')
    @Doc('update', classDto)
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body('update') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      const result = await this.service.update(Number(id), dto, relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
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
  }
  return BaseController;
}
