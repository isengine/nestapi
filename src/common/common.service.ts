import { BadRequestException } from '@nestjs/common';
import { DeepPartial, FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { OptionsDto } from '@src/common/dto/options.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { entityGetParams } from '@src/common/service/entity.service';
import { relationsCreate } from '@src/common/service/relations.service';
import { filterService } from '@src/common/service/filter.service';
import { optionsService } from '@src/common/service/options.service';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';

export class CommonService<
  Entity extends CommonEntity,
  Dto extends CommonDto,
  Filter
> {
  protected readonly repository: Repository<Entity>;

  error(e) {
    throw new BadRequestException(`Incorrect request conditions: ${e.message}`);
  }

  async find(
    where: FindOptionsWhere<any> = undefined,
    order: FindOptionsOrder<any> = { id: 'ASC' },
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Entity[]> {
    if (authId !== undefined) {
      const auth = { id: authId };
      where = { ...where, auth };
    }
    try {
      return await this.repository.find({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async findAll(
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Entity[]> {
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    const where: FindOptionsWhere<any> = {};
    if (authId !== undefined) {
      const auth = { id: authId };
      where.auth = auth;
    }
    try {
      return await this.repository.find({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async first(
    where: FindOptionsWhere<any> = undefined,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Entity> {
    if (authId !== undefined) {
      const auth = { id: authId };
      where = { ...where, auth };
    }
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    try {
      return await this.repository.findOne({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async many(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Entity[]> {
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    const where: FindOptionsWhere<any> = { id: In(ids?.map(i => Number(i) || 0)) };
    if (authId !== undefined) {
      const auth = { id: authId };
      where.auth = auth;
    }
    try {
      return await this.repository.find({
        relations: relationsDto?.map(i => i.name),
        order,
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async findOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Entity> {
    const where: FindOptionsWhere<any> = { id };
    if (authId !== undefined) {
      const auth = { id: authId };
      where.auth = auth;
    }
    try {
      return await this.repository.findOne({
        relations: relationsDto?.map(i => i.name),
        where,
      });
    }
    catch (e) {
      this.error(e);
    }
  }

  async filter(
    dto: Dto,
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Filter[]> {
    if (authId !== undefined) {
      const auth = { id: authId };
      dto = { ...dto, auth };
      if (!relationsDto) {
        relationsDto = [];
      }
      relationsDto.push({ name: 'auth', order: 'id', desc: false });
    }
    const { root, core, fields } = entityGetParams(this.repository.target);
    const query = this.repository.createQueryBuilder(root);
    const where = filterService(
      dto,
      searchDto,
      root,
      core,
      fields,
    );
    query.where(where);
    relationsCreate(query, relationsDto, root);
    try {
      return await optionsService(query, optionsDto, relationsDto, root);
    }
    catch (e) {
      this.error(e);
    }
  }

  async create(
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Entity> {
    delete dto.createdAt;
    delete dto.updatedAt;
    const entry: DeepPartial<any> = { ...dto };
    if (entry.id) {
      entry.id = `${entry.id}`;
    }
    if (authId !== undefined) {
      const auth = { id: authId };
      entry.auth = auth;
    }
    try {
      const created = await this.repository.save(entry);
      return await this.findOne(created.id, relationsDto, authId);
    }
    catch (e) {
      this.error(e);
    }
  }

  async update(
    id: number,
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<Entity> {
    if (id === undefined) {
      return;
    }

    const where: FindOptionsWhere<any> = { id };
    if (authId !== undefined) {
      const auth = { id: authId };
      where.auth = auth;
    }
    const find = await this.repository.findOne({
      where,
    });
    if (!find) {
      return;
    }

    dto.id = id;
    const entry: DeepPartial<any> = { ...dto };
    if (entry.id) {
      entry.id = `${entry.id}`;
    }

    try {
      const created = await this.repository.save(entry);
      return await this.findOne(created.id, relationsDto, authId);
    }
    catch (e) {
      this.error(e);
    }
  }

  async remove(
    id: number,
    authId: number = undefined,
  ): Promise<boolean> {
    const where: FindOptionsWhere<any> = { id };
    if (authId !== undefined) {
      const auth = { id: authId };
      where.auth = auth;
    }
    try {
      const result = await this.repository.delete(where);
      return !!result?.affected;
    }
    catch (e) {
      this.error(e);
    }
  }
}
