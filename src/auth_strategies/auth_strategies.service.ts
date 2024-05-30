import { DeepPartial, FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthStrategiesDto } from '@src/auth_strategies/auth_strategies.dto';
import { AuthStrategiesEntity } from '@src/auth_strategies/auth_strategies.entity';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { encrypt, decrypt } from '@src/common/service/crypt.service';

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

  async find(
    where: FindOptionsWhere<any> = undefined,
    order: FindOptionsOrder<any> = { id: 'ASC' },
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<AuthStrategiesEntity[]> {
    const result = await super.find(
      where,
      order,
      relationsDto,
      authId,
    );
    return await this.decodeEntries(result);
  }

  async findAll(
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<AuthStrategiesEntity[]> {
    const result = await super.findAll(
      relationsDto,
      authId,
    );
    return await this.decodeEntries(result);
  }

  async first(
    where: FindOptionsWhere<any> = undefined,
    order: FindOptionsOrder<any> = { id: 'ASC' },
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<AuthStrategiesEntity> {
    const result = await super.first(
      where,
      order,
      relationsDto,
      authId,
    );
    return await this.decodeTokens(result);
  }

  async many(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<AuthStrategiesEntity[]> {
    const result = await super.many(
      ids,
      relationsDto,
      authId,
    );
    return await this.decodeEntries(result);
  }

  async findOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number = undefined,
  ): Promise<AuthStrategiesEntity> {
    const result = await super.findOne(
      id,
      relationsDto,
      authId,
    );
    return await this.decodeTokens(result);
  }

  async encodeTokens(
    authStrategiesDto: AuthStrategiesDto,
  ): Promise<AuthStrategiesDto> {
    if (authStrategiesDto?.accessToken) {
      const accessToken = await encrypt(authStrategiesDto.accessToken);
      authStrategiesDto.accessToken = JSON.stringify(accessToken);
    }
    if (authStrategiesDto?.refreshToken) {
      const refreshToken = await encrypt(authStrategiesDto.refreshToken);
      authStrategiesDto.refreshToken = JSON.stringify(refreshToken);
    }
    return authStrategiesDto;
  }

  async decodeTokens(
    authStrategiesDto: AuthStrategiesEntity,
  ): Promise<AuthStrategiesEntity> {
    if (authStrategiesDto?.accessToken) {
      try {
        let { encrypted, iv } = JSON.parse(authStrategiesDto.accessToken);
        authStrategiesDto.accessToken = await decrypt(encrypted, iv);
      } catch {}
    }
    if (authStrategiesDto?.refreshToken) {
      try {
        let { encrypted, iv } = JSON.parse(authStrategiesDto.refreshToken);
        authStrategiesDto.refreshToken = await decrypt(encrypted, iv);
      } catch {}
    }
    return authStrategiesDto;
  }

  async decodeEntries(
    authStrategiesDto: Array<AuthStrategiesEntity>,
  ): Promise<AuthStrategiesEntity[]> {
    for await (const [index, item] of authStrategiesDto.entries()) {
      authStrategiesDto[index] = await this.decodeTokens(item);
    }
    return authStrategiesDto;
  }

  async updateBy(
    authStrategiesDto: AuthStrategiesDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<AuthStrategiesEntity> {
    authStrategiesDto = await this.encodeTokens(authStrategiesDto);
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
