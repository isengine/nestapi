import * as moment from 'moment';
import { BadRequestException } from '@nestjs/common';
import { DeepPartial, EntityTarget, Repository } from 'typeorm';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { FindDto } from '../dto/find.dto';
import { CommonService } from '../common.service';
import { parseDynamicWhereObject } from './dynamic.where.service';
import { prepareQuotes } from './quotes.service';
import { BindDto } from '../dto/bind.dto';
import { parseDynamicSaveObject } from './dynamic.save.service';

export class DynamicService<
  Dto extends CommonDto,
  Entity extends CommonEntity,
> extends CommonService<Dto, Entity> {
  // protected readonly repository: Repository<Entity>;
  protected readonly repository: Repository<any>;

  async createEntity(entity: DeepPartial<any>): Promise<any> {
    const quotes = prepareQuotes();
    const tableName = this.getTableName();

    const entityData = parseDynamicSaveObject(entity);
    const keys = Object.keys(entityData)
      .map((key) => `${quotes}${key}${quotes}`)
      .join(', ');
    const values = Object.values(entityData).join(', ');

    try {
      const query = `
        INSERT INTO ${tableName}
        (${keys})
        VALUES (${values});
      `;
      const result = await this.repository.query(query);
      return { id: result.insertId };
    } catch (e) {
      this.error(e);
    }
  }

  async updateEntity(entity: DeepPartial<any>): Promise<any> {
    const { id } = entity;

    const quotes = prepareQuotes();
    const tableName = this.getTableName();

    const entityData = parseDynamicSaveObject(entity);
    const set = Object.entries(entityData)
      .map(([key, value]) => `${quotes}${key}${quotes} = ${value}`)
      .join(', ');

    const where = `${quotes}id${quotes} = ${id}`;

    try {
      const query = `
        UPDATE ${tableName}
        SET ${set}
        WHERE ${where};
      `;
      return await this.repository.query(query);
    } catch (e) {
      this.error(e);
    }
  }

  async find(find: FindDto, bind: BindDto): Promise<Entity[]> {
    const { limit, offset, order, select } = find;
    const { id, name } = bind;

    let where = parseDynamicWhereObject(find.where);
    // "username.not.like": "%user%"
    // "username.and.not.like": ["%user1%", "%user2%"]

    if (id !== undefined) {
      where = { ...where, [name]: id };
    }

    try {
      const query = `
        ${this.selectToString(select)}
        ${this.fromToString()}
        ${this.whereToString(where)}
        ${this.orderToString(order)}
        ${this.limitToString(limit)}
        ${this.offsetToString(offset)};
      `;
      return await this.repository.query(query);
    } catch (e) {
      this.error(e);
    }
  }

  protected getTableName() {
    const { tableName } = this.repository.metadata;
    const quotes = prepareQuotes();
    return `${quotes}${tableName}${quotes}`;
  }

  protected fromToString() {
    const tableName = this.getTableName();
    return ` FROM ${tableName}`;
  }

  protected limitToString(limit) {
    limit = Number(limit);
    return limit ? ` LIMIT ${limit}` : '';
  }

  protected offsetToString(offset) {
    offset = Number(offset);
    return offset ? ` OFFSET ${offset}` : '';
  }

  protected orderToString(order) {
    let orderString = '';

    if (order && typeof order === 'object' && !Array.isArray(order)) {
      const quotes = prepareQuotes();
      orderString = Object.entries(order)
        .map(
          ([key, value]) =>
            `${quotes}${key}${quotes} ${`${value || ''}`.toUpperCase()}`,
        )
        .filter(Boolean)
        .join(', ');
    }

    return orderString ? ` ORDER BY ${orderString}` : '';
  }

  protected selectToString(select) {
    let selectString = '';

    if (select && typeof select === 'object' && !Array.isArray(select)) {
      select = Object.entries(select)
        .map(([key, value]) => (value !== false ? key : false))
        .filter(Boolean);
    }

    if (select && Array.isArray(select)) {
      const quotes = prepareQuotes();
      selectString = select
        .map((value) => `${quotes}${value}${quotes}`)
        .join(', ');
    }

    return `SELECT ${selectString || '*'}`;
  }

  protected whereToString(where) {
    return Array.isArray(where) && where.length > 0
      ? ` WHERE ${where.map((i) => `(${i})`).join(' AND ')}`
      : '';
  }

  error(e) {
    throw new BadRequestException(`Incorrect request conditions: ${e.message}`);
  }
}
