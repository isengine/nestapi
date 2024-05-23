import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthStrategiesDto } from '@src/auth_strategies/auth_strategies.dto';
import { AuthStrategiesEntity } from '@src/auth_strategies/auth_strategies.entity';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class AuthStrategiesService extends CommonService<
  AuthStrategiesEntity,
  AuthStrategiesDto,
  null
> {
  constructor(
    @InjectRepository(AuthStrategiesEntity)
    protected readonly repository: Repository<AuthStrategiesEntity>,
  ) {
    super();
  }

  async updateBy(
    authStrategiesDto: AuthStrategiesDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<AuthStrategiesEntity> {
    const strategy = await this.first({
      uid: authStrategiesDto.uid,
      name: authStrategiesDto.name,
      auth: {
        id: authStrategiesDto.auth.id,
      },
    });
    if (!strategy) {
      return await this.create(authStrategiesDto, relationsDto);
    }
    return await this.update(strategy.id, authStrategiesDto, relationsDto);
  }

  async removeBy(
    authStrategiesDto: AuthStrategiesDto,
  ): Promise<boolean> {
    const strategy = await this.first(authStrategiesDto);
    if (!strategy) {
      return;
    }
    return await this.remove(strategy.id);
  }
}
