import { DeepPartial, FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/service/common.service';
import { filterService } from '@src/typeorm/service/filter.service';
import { optionsService } from '@src/typeorm/service/options.service';
import { searchService } from '@src/typeorm/service/search.service';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { CommonEntity } from '@src/typeorm/entity/common.entity';

export class CreateService<
  Entity extends CommonEntity,
  Dto extends CommonDto,
  Filter
> {
  protected readonly repository: Repository<Entity>;
  protected readonly entity: Entity;

  async find(
    where: FindOptionsWhere<any> = undefined,
    order: FindOptionsOrder<any> = { id: 'ASC' },
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Entity[]> {
    return await this.repository.find({
      relations: relationsDto?.map(i => i.name),
      order,
      where,
    });
  }

  async findAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Entity[]> {
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    return await this.repository.find({
      relations: relationsDto?.map(i => i.name),
      order,
    });
  }

  async findOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Entity> {
    const where: FindOptionsWhere<any> = { id };
    return await this.repository.findOne({
      relations: relationsDto?.map(i => i.name),
      where,
    });
  }

  async findMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Entity[]> {
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    const where: FindOptionsWhere<any> = { id: In(ids?.map(i => Number(i) || 0)) };
    return await this.repository.find({
      relations: relationsDto?.map(i => i.name),
      order,
      where,
    });
  }

  async filter(
    dto: Dto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Filter[]> {
    const { root, fields } = commonEntityGetParams(this.entity);
    const query = this.repository.createQueryBuilder(root);
    const where = filterService(dto, root, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async search(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Filter[]> {
    const { root, core, fields } = commonEntityGetParams(this.entity);
    const query = this.repository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async create(
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Entity> {
    delete dto.createdAt;
    delete dto.updatedAt;
    const entry: DeepPartial<any> = { ...dto };
    const created = await this.repository.save(entry);
    return await this.findOne(created.id, relationsDto);
  }

  async update(
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Entity> {
    const { id } = dto;
    if (id === undefined) {
      return;
    }
    return await this.create(dto, relationsDto);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return !!result?.affected;
  }
}
