import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesEntity } from '@src/roles/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}

  async rolesGetAll(
    relations: Array<string> = undefined,
  ): Promise<RolesEntity[]> {
    return await this.rolesRepository.find({
      relations,
    });
  }

  async rolesGetOne(
    id: number,
    relations: Array<string> = undefined,
  ): Promise<RolesEntity> {
    return await this.rolesRepository.findOne({
      relations,
      where: { id },
    });
  }

  async rolesGetByUserId(
    userId: number,
    relations: Array<string> = undefined,
  ): Promise<RolesEntity[]> {
    const roles = await this.rolesRepository.find({
      relations,
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
