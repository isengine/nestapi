import { Controller, Get, NotFoundException } from '@nestjs/common';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesService } from '@src/roles/roles.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/app.decorator';
import { CommonController } from '@src/common/common.controller';
import { RolesEntity } from '@src/roles/roles.entity';
import { RolesFilter } from '@src/roles/roles.filter';

@Controller('roles')
export class RolesController extends CommonController(
  'roles',
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

  @Get('get_by_user_id')
  async rolesGetByUserId(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.service.rolesGetByUserId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }
}
