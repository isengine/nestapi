import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StrategiesDto } from '@src/strategies/strategies.dto';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/service/common.service';

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

  async findByAuthId(
    authId: number,
    name: string,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<StrategiesEntity> {
    const strategy = await this.repository.find({
      relations: relationsDto?.map(i => i.name),
      where: {
        name,
        auth: {
          id: authId,
        },
      },
      take: 1,
    });
    if (!strategy || !strategy.length) {
      return;
    }
    const result = strategy[0];
    return result;
  }

  async updateByAuthId(
    strategiesDto: StrategiesDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<StrategiesEntity> {
    const authId = strategiesDto.auth?.id;
    delete strategiesDto.auth;
    const strategy = await this.findByAuthId(
      authId,
      strategiesDto.name,
    );
    if (!strategy) {
      return await this.create(
        {
          ...strategiesDto,
          auth: {
            id: authId,
          },
        },
        relationsDto,
      );
    }
    strategiesDto.id = strategy.id;
    return await this.update(strategiesDto, relationsDto);
  }

  async removeByAuthId(
    authId: number,
    name: string,
  ): Promise<boolean> {
    const strategy = await this.findByAuthId(authId, name);
    if (!strategy) {
      return;
    }
    return await this.remove(strategy.id);
  }
}
