import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesEntity } from '@src/roles/roles.entity';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}

  async rolesGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RolesEntity[]> {
    return await this.rolesRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async rolesGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RolesEntity> {
    return await this.rolesRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async rolesGetByUserId(
    userId: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RolesEntity[]> {
    const roles = await this.rolesRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!roles || !roles.length) {
      return;
    }
    return roles;
  }

  async rolesCreate(rolesDto: RolesDto): Promise<RolesEntity> {
    return await this.rolesRepository.save({ ...rolesDto });
  }

  async rolesUpdate(rolesDto: RolesDto): Promise<RolesEntity> {
    const { id } = rolesDto;
    if (id === undefined) {
      return;
    }
    delete rolesDto.createdAt;
    delete rolesDto.updatedAt;
    return await this.rolesCreate(rolesDto);
  }

  async rolesRemove(id: number): Promise<boolean> {
    const result = await this.rolesRepository.delete({ id });
    return !!result?.affected;
  }
}
