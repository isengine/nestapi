import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AuthRolesDto } from '@src/auth_roles/auth_roles.dto';
import { AuthRolesService } from '@src/auth_roles/auth_roles.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/common/common.decorator';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { AuthRolesEntity } from '@src/auth_roles/auth_roles.entity';
import { AuthRolesFilter } from '@src/auth_roles/auth_roles.filter';

@Controller('auth_roles')
export class AuthRolesController extends ProtectedController(
  'Роли и права пользователей',
  AuthRolesEntity,
  AuthRolesDto,
)<
  AuthRolesService,
  AuthRolesEntity,
  AuthRolesDto,
  AuthRolesFilter
> {
  constructor(
    readonly service: AuthRolesService,
  ) {
    super();
  }

  @Get('get_by_auth_id')
  async getByAuthId(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.service.getByAuthId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }
}
