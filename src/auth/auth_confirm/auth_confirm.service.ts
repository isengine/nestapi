import { v4 } from 'uuid';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from '@src/common/service/crypt.service';
import { RandomService } from '@src/random/random.service';
import { AuthConfirmEntity } from './auth_confirm.entity';

@Injectable()
export class AuthConfirmService {
  constructor(
    @InjectRepository(AuthConfirmEntity)
    protected readonly repository: Repository<AuthConfirmEntity>,
    protected readonly randomService: RandomService,
  ) {}

  async findById(id: number): Promise<AuthConfirmEntity> {
    const where: FindOptionsWhere<any> = { id };
    return await this.repository.findOne({
      where,
      relations: ['auth'],
    });
  }

  async findByCode(code: string, type = 'code'): Promise<AuthConfirmEntity> {
    const where: FindOptionsWhere<any> = { code, type };
    if (type === 'reset') {
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
    const entrie = {
      auth: {
        id: auth.id,
      },
      type,
      code: `${v4()}-${hash(auth.id)}`,
    };

    await this.repository.delete({
      auth: {
        id: auth.id,
      },
      type,
    });

    const created = await this.repository.save(entrie);
    return await this.findById(created.id);
  }

  async generate(auth, type = 'code') {
    const code = this.randomService.randomNum(6);
    const exists = await this.findByCode(code);
    if (exists) {
      return await this.generate(auth);
    }
    const entrie = {
      auth: {
        id: auth.id,
      },
      type,
      code,
    };
    const created = await this.repository.save(entrie);
    return await this.findById(created.id);
  }

  async validate(code, type = 'code') {
    const entrie = await this.findByCode(code, type);
    if (entrie) {
      await this.remove(entrie.id);
    }
    return entrie;
  }
}
