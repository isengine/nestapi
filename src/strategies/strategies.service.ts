import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StrategiesDto } from '@src/strategies/strategies.dto';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class StrategiesService extends CommonService<
  StrategiesEntity,
  StrategiesDto,
  null
> {
  constructor(
    @InjectRepository(StrategiesEntity)
    protected readonly repository: Repository<StrategiesEntity>,
  ) {
    super();
  }

  async updateBy(
    strategiesDto: StrategiesDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<StrategiesEntity> {
    const strategy = await this.first(strategiesDto);
    if (!strategy) {
      return await this.create(strategiesDto, relationsDto);
    }
    return await this.update(strategy.id, strategiesDto, relationsDto);
  }

  async removeBy(
    strategiesDto: StrategiesDto,
  ): Promise<boolean> {
    const strategy = await this.first(strategiesDto);
    if (!strategy) {
      return;
    }
    return await this.remove(strategy.id);
  }
}
