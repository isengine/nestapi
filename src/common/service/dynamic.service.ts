import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommonDto } from '@src/common/common.dto';
import { CommonEntity } from '@src/common/common.entity';
import { FindDto } from '../dto/find.dto';
import { CommonService } from '../common.service';
import { parseDynamicWhereObject } from './dynamic.where.service';
import { prepareQuotes } from './quotes.service';
import { BindDto } from '../dto/bind.dto';

export class DynamicService<
  Dto extends CommonDto,
  Entity extends CommonEntity,
> extends CommonService<Dto, Entity> {
  protected readonly repository: Repository<Entity>;

  async find(find: FindDto, bind: BindDto): Promise<Entity[]> {
    const { limit, offset, order, select } = find;
    const { id, name } = bind;

    if (id !== undefined) {
      find.where[`${name || 'auth'}_id`] = +id;
    }

    const where = parseDynamicWhereObject(find.where);
    // "username.not.like": "%user%"
    // "username.and.not.like": ["%user1%", "%user2%"]

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

  protected fromToString() {
    const { tableName } = this.repository.metadata;
    const quotes = prepareQuotes();
    return ` FROM ${quotes}${tableName}${quotes}`;
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
