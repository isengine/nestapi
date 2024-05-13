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
  Patch,
  Type,
} from '@nestjs/common';
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { Data } from '@src/common/common.decorator';
import { CommonService } from '@src/common/common.service';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { ApiOperation, ApiBody, ApiParam, ApiQuery, getSchemaPath, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';
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
    @ApiOperation({ summary: 'Найти все записи' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связями',
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
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity[]> {
      return await this.service.find(where, order, relationsDto);
    }

    @Get('find/:id')
    @ApiOperation({ summary: 'Найти запись по ее id' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связями',
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
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      const result = await this.service.findOne(Number(id), relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('first')
    @ApiOperation({ summary: 'Найти одну запись по условиям' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связями',
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
      description: 'Объект с нужными полями записи и их значениями, по которым запись будет выбираться',
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
      type: classDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка',
    })
    async first(
      @Data('where') where: Object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.first(where, order, relationsDto);
    }

    @Get('many/:ids')
    @ApiOperation({ summary: 'Найти записи по нескольким id' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связями',
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
    @ApiOperation({ summary: 'Отфильтровать записи, которые имеют совпадения и соответствуют заданным условиям' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связями',
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
    @ApiQuery({
      name: 'where',
      required: false,
      description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
      type: classDto.name,
    })
    @ApiExtraModels(classDto, SearchDto, OptionsDto, RelationsDto)
    @ApiBody({ schema: { anyOf: [
      { $ref: getSchemaPath(classDto) },
      { $ref: getSchemaPath(SearchDto) },
      { $ref: getSchemaPath(OptionsDto) },
      { $ref: getSchemaPath(RelationsDto) },
    ] } })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
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
    @ApiOperation({ summary: 'Создать запись' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связями',
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
      auth: AuthDto = undefined,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto);
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Обновить запись по ее id' })
    @ApiQuery({
      name: 'relations',
      required: false,
      description: 'Массив объектов с нужными связями',
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
    @ApiOperation({ summary: 'Удалить запись по ее id' })
    @ApiParam({ name: 'id', required: true, description: 'Id номер записи' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: Boolean })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async remove(
      @Param('id', ParseIntPipe) id: number,
      auth: AuthDto = undefined,
    ): Promise<boolean> {
      return await this.service.remove(id);
    }
  }
  return BaseController;
}
