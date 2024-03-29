import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesEntity } from '@src/roles/roles.entity';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/service/common.service';
import { RolesFilter } from '@src/roles/roles.filter';

@Injectable()
export class RolesService extends CommonService<
  RolesEntity,
  RolesDto,
  RolesFilter
> {
  constructor(
    @InjectRepository(RolesEntity)
    protected readonly repository: Repository<RolesEntity>,
  ) {
    super();
  }

  async rolesGetByUserId(
    userId: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RolesEntity[]> {
    const roles = await this.repository.find({
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
}
