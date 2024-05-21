import { v4 } from 'uuid';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthConfirmEntity } from '@src/auth_confirm/auth_confirm.entity';
import { RandomService } from '@src/random/random.service';

@Injectable()
export class AuthConfirmService {
  constructor(
    @InjectRepository(AuthConfirmEntity)
    protected readonly repository: Repository<AuthConfirmEntity>,
    protected readonly randomService: RandomService,
  ) {}

  async findById(
    id: number
  ): Promise<AuthConfirmEntity> {
    const where: FindOptionsWhere<any> = { id };
    return await this.repository.findOne({
      where,
      relations: ['auth'],
    });
  }

  async findByUsername(
    username: string,
    type: string = 'code',
  ): Promise<AuthConfirmEntity> {
    const where: FindOptionsWhere<any> = {
      auth: {
        username,
      },
      type,
    };
    if (type === 'restore') {
      const now = new Date();
      now.setHours(now.getHours() - 1);
      where.createdAt = MoreThan(now);
    }
    return await this.repository.findOne({
      where,
      relations: ['auth'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCode(
    code: string,
    type: string = 'code',
  ): Promise<AuthConfirmEntity> {
    const where: FindOptionsWhere<any> = { code, type };
    if (type === 'restore') {
      const now = new Date();
      now.setHours(now.getHours() - 1);
      where.createdAt = MoreThan(now);
    }
    return await this.repository.findOne({
      where,
      relations: ['auth'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return !!result?.affected;
  }

  async create(auth, type = 'code') {
    const entry = {
      auth: {
        id: auth.id,
      },
      type,
      code: v4(),
    };
    const created = await this.repository.save(entry);
    return await this.findById(created.id);
  }

  async generate(auth, type = 'code') {
    const code = this.randomService.randomNum(6);
    const exists = await this.findByCode(code);
    if (exists) {
      return await this.generate(auth);
    }
    const entry = {
      auth: {
        id: auth.id,
      },
      type,
      code,
    };
    const created = await this.repository.save(entry);
    return await this.findById(created.id);
  }

  async validate(code, type = 'code') {
    const entry = await this.findByCode(code, type);
    if (entry) {
      await this.remove(entry.id);
    }
    return entry;
  }

}
