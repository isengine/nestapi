import { BadRequestException } from '@nestjs/common';
import {
  And,
  DeepPartial,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { relationsOrder } from '@src/common/service/relations.service';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { FindDto } from './dto/find.dto';
import { FindManyDto } from './dto/find_many.dto';
import { FindOneDto } from './dto/find_one.dto';
import { parseWhereObject } from './service/where.service';
import { removePrivateFields } from './service/private_fields.service';
import { searchService } from './service/search.service';
import { bind } from './service/bind.service';
import { BindDto } from './dto/bind.dto';

export class CommonService<Dto extends CommonDto, Entity extends CommonEntity> {
  protected readonly repository: Repository<Entity>;

  async find(
    find: FindDto = {},
    bind: BindDto = { allow: true },
  ): Promise<Entity[]> {
    const {
      relations,
      limit: take,
      offset: skip,
      search,
      ...otherParams
    } = find;

    const { id, name } = bind;

    let where = parseWhereObject(find.where);
    // "username.not.like": "%user%"
    // "username.and.not.like": ["%user1%", "%user2%"]

    if (id !== undefined) {
      where = { ...where, [name]: { id } };
    }

    const params = {
      ...otherParams,
      relations: relations?.map((i) => i.name),
      where,
      take,
      skip,
    };

    try {
      let result;

      result = await this.repository.find(params);
      result = relationsOrder(result, relations);

      if (search) {
        result = result
          .map((i) => {
            const contains = searchService(i, search);
            return contains ? i : false;
          })
          .filter(Boolean);
      }

      result = await removePrivateFields(
        {
          result,
          repository: this.repository,
        },
        bind,
      );
      return result;
    } catch (e) {
      this.error(e);
    }
  }

  async findFirst(
    find: FindDto,
    bind: BindDto = { allow: true },
  ): Promise<Entity> {
    const [result] = await this.find(
      {
        ...find,
        limit: 1,
      },
      bind,
    );
    return result;
  }

  async findMany(
    findMany: FindManyDto,
    bind: BindDto = { allow: true },
  ): Promise<Entity[]> {
    const { ids, ...find } = findMany;
    const order: FindOptionsOrder<any> = { id: 'ASC' };
    const where: FindOptionsWhere<any> = {
      id: In(ids?.map((i) => Number(i) || 0)),
    };
    return await this.find(
      {
        ...find,
        order,
        where,
        limit: 0,
        offset: 0,
      },
      bind,
    );
  }

  async findOne(
    findOne: FindOneDto,
    bind: BindDto = { allow: true },
  ): Promise<Entity> {
    const { id, ...find } = findOne;
    const where: FindOptionsWhere<any> = { ...find.where, id };
    const [result] = await this.find(
      {
        ...find,
        where,
        limit: 1,
        offset: 0,
      },
      bind,
    );
    return result;
  }

  async count(find: FindDto, bind: BindDto = { allow: true }): Promise<number> {
    find.select = { id: true };
    const result = await this.find(find, bind);
    return result && Array.isArray(result) ? result.length : 0;
  }

  async create(
    dto: Dto,
    relations: Array<RelationsDto> = undefined,
    bind: BindDto = { allow: true },
  ): Promise<Entity> {
    // next this columns from bind
    delete dto.id;
    // delete dto.createdAt;
    // delete dto.updatedAt;

    if (bind.id !== undefined) {
      dto[bind.name || 'auth'] = { id: bind.id };
    }

    const entity: DeepPartial<any> = { ...dto };

    try {
      const { id } = await this.createEntity(entity);
      return await this.findOne(
        {
          id,
          relations,
        },
        bind,
      );
    } catch (e) {
      this.error(e);
    }
  }

  async createEntity(entity: DeepPartial<any>): Promise<any> {
    return await this.repository.save(entity);
  }

  async update(
    id: number,
    dto: Dto,
    relations: Array<RelationsDto> = undefined,
    bind: BindDto = { allow: true },
  ): Promise<Entity> {
    if (id === undefined) {
      return;
    }

    const select = { id: true };
    const find = await this.findOne({ id, select, relations }, bind);
    if (!find) {
      return;
    }

    // next from bind
    // delete dto.createdAt;
    // delete dto.updatedAt;

    const entity: DeepPartial<any> = { ...dto, id };

    try {
      await this.updateEntity(entity);
      return await this.findOne(
        {
          id,
          relations,
        },
        bind,
      );
    } catch (e) {
      this.error(e);
    }
  }

  async updateEntity(entity: DeepPartial<any>): Promise<any> {
    return await this.repository.save(entity);
  }

  async remove(id: number, bind: BindDto = { allow: true }): Promise<boolean> {
    const where: FindOptionsWhere<any> = { id };
    if (bind.id !== undefined) {
      where[bind.name || 'auth'] = { id: bind.id };
    }
    try {
      const result = await this.repository.delete(where);
      return !!result?.affected;
    } catch (e) {
      this.error(e);
    }
  }

  async sortPosition(
    field: string,
    find: FindDto,
    bind: BindDto = { allow: true },
  ): Promise<boolean> {
    const entries = await this.find(find, bind);

    if (!entries) {
      return;
    }

    try {
      await this.repository.manager.transaction(
        async (transactionalManager) => {
          const entityTarget: EntityTarget<Entity> = this.repository.target;

          if (find.where) {
            const resetEntries: DeepPartial<any> = {
              [field]: 0,
            };

            await transactionalManager.update(entityTarget, {}, resetEntries);
          }

          entries.forEach((entrie, index) => {
            entrie[field] = index + 1;
          });

          await transactionalManager.save(entityTarget, entries);
        },
      );

      return true;
    } catch (e) {
      this.error(e);
    }
  }

  async movePosition(
    id: number,
    field: string,
    position: number,
    bind: BindDto = { allow: true },
  ): Promise<boolean> {
    if (position === undefined || position === null) {
      return false;
    }

    const entrie = await this.findOne(
      {
        id,
        select: {
          [field]: true,
        },
      },
      bind,
    );

    if (!entrie) {
      return false;
    }

    try {
      const oldPosition = +entrie[field] || 0;
      const newPosition = +position || 0;

      if (oldPosition === newPosition) {
        return false;
      }

      await this.repository.manager.transaction(
        async (transactionalManager) => {
          const entityTarget: EntityTarget<Entity> = this.repository.target;

          const updateEntries: DeepPartial<any> = {
            [field]: () =>
              oldPosition > newPosition ? `${field} + 1` : `${field} - 1`,
          };

          const whereEntries: DeepPartial<any> = {
            [field]:
              oldPosition > newPosition
                ? And(MoreThanOrEqual(newPosition), LessThan(oldPosition))
                : And(MoreThan(oldPosition), LessThanOrEqual(newPosition)),
          };

          await transactionalManager.update(
            entityTarget,
            whereEntries,
            updateEntries,
          );

          const updateCurrentEntrie: DeepPartial<any> = {
            [field]: newPosition,
          };
          await transactionalManager.update(
            entityTarget,
            id,
            updateCurrentEntrie,
          );
        },
      );

      return true;
    } catch (e) {
      this.error(e);
    }
  }

  bind(entrie, data) {
    return bind(entrie, data);
  }

  error(e) {
    throw new BadRequestException(`Incorrect request conditions: ${e.message}`);
  }
}
