import { Controller, Get, NotFoundException } from '@nestjs/common';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesService } from '@src/roles/roles.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/common/common.decorator';
import { ProtectedController } from '@src/common/controller/protected.controller';
import { RolesEntity } from '@src/roles/roles.entity';
import { RolesFilter } from '@src/roles/roles.filter';

@Controller('roles')
export class RolesController extends ProtectedController(
  'Роли и права пользователей',
  RolesEntity,
  RolesDto,
)<
  RolesService,
  RolesEntity,
  RolesDto,
  RolesFilter
> {
  constructor(
    readonly service: RolesService,
  ) {
    super();
  }

  @Get('get_by_auth_id')
  async rolesGetByAuthId(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.service.rolesGetByAuthId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }
}
