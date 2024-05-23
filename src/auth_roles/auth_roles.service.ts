import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRolesDto } from '@src/auth_roles/auth_roles.dto';
import { AuthRolesEntity } from '@src/auth_roles/auth_roles.entity';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { AuthRolesFilter } from '@src/auth_roles/auth_roles.filter';

@Injectable()
export class AuthRolesService extends CommonService<
  AuthRolesEntity,
  AuthRolesDto,
  AuthRolesFilter
> {
  constructor(
    @InjectRepository(AuthRolesEntity)
    protected readonly repository: Repository<AuthRolesEntity>,
  ) {
    super();
  }

  async getByAuthId(
    authId: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<AuthRolesEntity[]> {
    const roles = await this.repository.find({
      relations: relationsDto?.map(i => i.name),
      where: {
        auth: {
          id: authId,
        },
      },
    });
    if (!roles || !roles.length) {
      return;
    }
    return roles;
  }
}
