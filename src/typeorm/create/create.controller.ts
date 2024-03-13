import { Body, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';
import { CreateService } from '@src/typeorm/create/create.service';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { CommonEntity } from '@src/typeorm/entity/common.entity';

export class CreateController<
  Service extends CreateService<Entity, Dto, Filter>,
  Entity extends CommonEntity,
  Dto extends CommonDto,
  Filter
> {
  protected readonly service: Service;

  @Get('find')
  async find(
    @Data('where') where: object,
    @Data('order') order: object,
    @Data('relations') relationsDto: Array<RelationsDto>
  ): Promise<Entity[]> {
    return await this.service.find(where, order, relationsDto);
  }

  @Get('findall')
  async findAll(
    @Data('relations') relationsDto: Array<RelationsDto>,
  ): Promise<Entity[]> {
    return await this.service.findAll(relationsDto);
  }

  @Get('findone')
  async findOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ): Promise<Entity> {
    const result = await this.service.findOne(id, relationsDto);
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
