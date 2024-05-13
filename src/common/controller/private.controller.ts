import {
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Type,
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { PrivateDto } from '@src/common/dto/private.dto';
import { PrivateEntity } from '@src/common/entity/private.entity';
import { ApiOperation, ApiBody, ApiParam, ApiQuery, getSchemaPath, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { OptionsDto } from '@src/common/dto/options.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Data } from '@src/common/common.decorator';

export const PrivateController = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
) => {
  class BasePrivateController<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends PrivateEntity,
    Dto extends PrivateDto,
    Filter
  > extends ProtectedController(
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
      @Self() auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.find(where, order, relationsDto, authId);
    }

    @Auth()
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
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      const result = await this.service.findOne(Number(id), relationsDto, authId);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Auth()
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
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.first(where, order, relationsDto, authId);
    }

    @Auth()
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
      @Self() auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      const result = await this.service.many(ids, relationsDto, authId);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Auth()
    @Get('self')
    @ApiOperation({ summary: 'Найти записи, принадлежащие учетной записи пользователя' })
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
    async self(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity[]> {
      const authId = auth.id;
      return await this.service.find(where, order, relationsDto, authId);
    }

    @Auth()
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
      @Self() auth: AuthDto,
    ): Promise<Filter[]> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      const result = await this.service.filter(
        dto,
        searchDto,
        optionsDto,
        relationsDto,
        authId,
      );
      if (!result) {
        throw new NotFoundException('Any results not found');
      }
      return result;
    }
  }
  return BasePrivateController;
}
