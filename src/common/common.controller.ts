import { Body, Get, Post, Put, Delete, HttpStatus, NotFoundException, Type, Param } from '@nestjs/common';
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { Data } from '@src/app.decorator';
import { CommonService } from '@src/common/service/common.service';
import { CommonDto } from '@src/common/dto/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    @ApiParam({ name: 'where', required: false, description: 'Id номер записи' })
    @ApiParam({ name: 'order', required: false, description: 'Id номер записи' })
    @ApiParam({ name: 'relations', type: 'RelationsDto', required: false, description: 'Id номер записи' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: [classDto] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async find(
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('relations') relationsDto: Array<RelationsDto>
    ): Promise<Entity[]> {
      return await this.service.find(where, order, relationsDto);
    }

    @Get('find/:id')
    @ApiOperation({ summary: 'Найти запись по ее id' })
    @ApiParam({ name: 'id', required: true, description: 'Id номер записи' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено', type: classDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
    async findOne(
      @Param('id') id: number | string,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      const result = await this.service.findOne(Number(id), relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('findmany')
    async findMany(
      @Data('ids') ids: Array<number | string>,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity[]> {
      const result = await this.service.findMany(ids, relationsDto);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Get('filter')
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
    async create(
      @Data('create') dto: Dto,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      return await this.service.create(dto, relationsDto);
    }

    @Put('update')
    async update(
      @Data('update') dto: Dto,
      @Data('relations') relationsDto: Array<RelationsDto>,
    ): Promise<Entity> {
      return await this.service.update(dto, relationsDto);
    }

    @Delete('remove')
    async remove(
      @Body('id') id: number,
    ): Promise<boolean> {
      return await this.service.remove(id);
    }
  }
  return BaseController;
}
