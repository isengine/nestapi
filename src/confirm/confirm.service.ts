import { v4 } from 'uuid';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmEntity } from '@src/confirm/confirm.entity';
import { RandomService } from '@src/random/random.service';

@Injectable()
export class ConfirmService {
  constructor(
    @InjectRepository(ConfirmEntity)
    protected readonly repository: Repository<ConfirmEntity>,
    protected readonly randomService: RandomService,
  ) {}

  async confirmFindById(
    id: number
  ): Promise<ConfirmEntity> {
    const where: FindOptionsWhere<any> = { id };
    return await this.repository.findOne({
      where,
      relations: ['auth'],
    });
  }

  async confirmFindByUsername(
    username: string,
    type: string = 'code',
  ): Promise<ConfirmEntity> {
    const where: FindOptionsWhere<any> = {
      auth: {
        username,
      },
      type,
    };
    return await this.repository.findOne({
      where,
      relations: ['auth'],
    });
  }

  async confirmFindByCode(
    code: string,
    type: string = 'code',
  ): Promise<ConfirmEntity> {
    const where: FindOptionsWhere<any> = { code, type };
    return await this.repository.findOne({
      where,
      relations: ['auth'],
    });
  }

  async confirmRemove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return !!result?.affected;
  }

  async confirmCreate(auth, type = 'code') {
    const entry = {
      auth: {
        id: auth.id,
      },
      type,
      code: v4(),
    };
    const created = await this.repository.save(entry);
    return await this.confirmFindById(created.id);
  }

  async confirmGenerate(auth, type = 'code') {
    const code = this.randomService.randomNum(6);
    const exists = await this.confirmFindByCode(code);
    if (exists) {
      return await this.confirmGenerate(auth);
    }
    const entry = {
      auth: {
        id: auth.id,
      },
      type,
      code,
    };
    const created = await this.repository.save(entry);
    return await this.confirmFindById(created.id);
  }

  async confirmValidate(code, type = 'code') {
    const entry = await this.confirmFindByCode(code, type);
    if (entry) {
      await this.confirmRemove(entry.id);
    }
    return entry;
  }

}
