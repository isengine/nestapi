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
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { ProtectedService } from '@src/common/service/protected.service';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { ApiOperation, ApiBody, ApiParam, ApiQuery, getSchemaPath, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { Auth, Self } from '@src/auth/auth.decorator';
import { CommonController } from '@src/common/common.controller';

export const ProtectedController = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
) => {
  class BaseProtectedController<
    Service extends ProtectedService<Entity, Dto, Filter>,
    Entity extends ProtectedEntity,
    Dto extends ProtectedDto,
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
      @Self() authId: number,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto, authId);
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
      @Self() authId: number,
    ): Promise<Entity> {
      const result = await this.service.update(Number(id), dto, relationsDto, authId);
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
      @Self() authId: number,
    ): Promise<boolean> {
      return await this.service.remove(id, authId);
    }
  }
  return BaseProtectedController;
}
