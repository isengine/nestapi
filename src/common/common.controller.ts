import {
  Body,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Type,
} from '@nestjs/common';
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { Data } from '@src/app.decorator';
import { CommonService } from '@src/common/service/common.service';
import { CommonDto } from '@src/common/dto/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { ApiOperation, ApiBody, ApiParam, ApiQuery, getSchemaPath, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';

export const CommonController = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
  classFilter = null,
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
    @ApiOperation({ summary: 'Найти все записи' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiQuery({
      name: 'order',
      required: false,
      description: 'Объект с полями записи и значением ASC/DESC, для сортировки записей по этим полям',
      type: 'необязательный',
      example: JSON.stringify({ id: 'DESC' }),
    })
    @ApiQuery({
      name: 'where',
      required: false,
      description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
      type: `${classDto.name}, необязательный`,
      example: JSON.stringify({ id: 1 }),
    })
    @ApiExtraModels(classDto, RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(classDto) },
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Выполнено',
      type: [classDto],
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка',
    })
    async find(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>
    ): Promise<Entity[]> {
      return await this.service.find(where, order, relationsDto);
    }

    @Get('find/:id')
    @ApiOperation({ summary: 'Найти запись по ее id' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Id номер записи',
    })
    @ApiExtraModels(RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Выполнено',
      type: classDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка',
    })
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      const result = await this.service.findOne(Number(id), relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('findmany/:ids')
    @ApiOperation({ summary: 'Найти записи по нескольким id' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiParam({
      name: 'ids',
      required: true,
      description: 'Id номера записей через запятую',
      example: '1,2,3'
    })
    @ApiExtraModels(RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Выполнено',
      type: [classDto],
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка',
    })
    async findMany(
      @Param('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: Array<number>,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity[]> {
      const result = await this.service.findMany(ids, relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('findfirst')
    @ApiOperation({ summary: 'Найти одну запись по условиям' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiQuery({
      name: 'where',
      required: true,
      description: 'Объект с нужными полями записи и их значениями, по которым запись будет выбираться',
      type: `${classDto.name}, обязательный`,
      example: JSON.stringify({ id: 1 }),
    })
    @ApiExtraModels(classDto, RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(classDto) },
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Выполнено',
      type: classDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка',
    })
    async findFirst(
      @Data('where') where: object,
      @Data('relations') relationsDto: Array<RelationsDto>
    ): Promise<Entity> {
      return await this.service.findFirst(where, relationsDto);
    }

    @Get('filter')
    @ApiOperation({ summary: 'Отфильтровать записи, поля которых соответствуют заданным условиям' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiQuery({
      name: 'options',
      required: false,
      description: 'В опциях вы можете задать лимиты и группировку',
      type: 'OptionsDto, необязательный',
    })
    @ApiQuery({
      name: 'filter',
      required: false,
      description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
      type: classDto.name,
    })
    @ApiExtraModels(classDto, OptionsDto, RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(classDto) },
      { $ref: getSchemaPath(OptionsDto) },
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: [classFilter] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async filter(
      @Data('filter') dto: Dto,
      @Data('options') optionsDto: OptionsDto,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Filter[]> {
      const result = await this.service.filter(
        dto,
        optionsDto,
        relationsDto,
      );
      if (!result) {
        throw new NotFoundException('Any results not found');
      }
      return result;
    }

    @Get('search')
    @ApiOperation({ summary: 'Найти записи, которые имеют заданные совпадения в заданных полях' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiQuery({
      name: 'options',
      required: false,
      description: 'В опциях вы можете задать лимиты и группировку',
      type: 'OptionsDto, необязательный',
    })
    @ApiQuery({
      name: 'search',
      required: false,
      description: 'Объект с полями и текстом, согласно которым будет вестись поиск',
      type: 'SearchDto',
    })
    @ApiExtraModels(SearchDto, OptionsDto, RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(SearchDto) },
      { $ref: getSchemaPath(OptionsDto) },
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: [classFilter] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async search(
      @Data('search') searchDto: SearchDto,
      @Data('options') optionsDto: OptionsDto,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Filter[]> {
      const result = await this.service.search(
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
    @ApiOperation({ summary: 'Создать запись' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiQuery({
      name: 'create',
      required: false,
      description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
      type: classDto.name,
    })
    @ApiExtraModels(classDto, RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(classDto) },
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: classDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto);
    }

    @Put('update')
    @ApiOperation({ summary: 'Обновить запись' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связами',
      type: '[RelationsDto], необязательный',
      example: JSON.stringify([{ name: 'table', order: 'id', desc: true }]),
    })
    @ApiQuery({
      name: 'update',
      required: false,
      description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
      type: classDto.name,
    })
    @ApiExtraModels(classDto, RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(classDto) },
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: classDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async update(
      @Body('update') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      return await this.service.update(dto, relationsDto);
    }

    @Delete('remove/:id')
    @ApiOperation({ summary: 'Удалить запись по ее id' })
    @ApiParam({ name: 'id', required: true, description: 'Id номер записи' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: Boolean })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async remove(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<boolean> {
      return await this.service.remove(id);
    }
  }
  return BaseController;
}
