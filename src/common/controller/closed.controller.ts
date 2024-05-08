import {
  Body,
  Delete,
  HttpStatus,
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
import { ApiOperation, ApiBody, ApiParam, ApiQuery, getSchemaPath, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { CommonController } from '@src/common/common.controller';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';

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
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      if (!auth?.isSuperuser) {
        throw new ForbiddenException('You have no rights!');
      }
      return await this.service.create(dto, relationsDto);
    }

    @Auth()
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
    @ApiOperation({ summary: 'Удалить запись по ее id' })
    @ApiParam({ name: 'id', required: true, description: 'Id номер записи' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: Boolean })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
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
