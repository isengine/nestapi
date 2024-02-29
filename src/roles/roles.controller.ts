import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesService } from '@src/roles/roles.service';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { Data } from '@src/app.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('get_all')
  async rolesGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.rolesService.rolesGetAll(relationsDto);
  }

  @Get('get_one')
  async rolesGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.rolesService.rolesGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('get_by_user_id')
  async rolesGetByUserId(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.rolesService.rolesGetByUserId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async rolesCreate(@Body() rolesDto: RolesDto) {
    return await this.rolesService.rolesCreate(rolesDto);
  }

  // @Put('update')
  @Post('update')
  async rolesUpdate(@Body() rolesDto: RolesDto) {
    return await this.rolesService.rolesUpdate(rolesDto);
  }

  // @Delete('remove')
  @Post('remove')
  async rolesRemove(@Body('id') id: number) {
    return await this.rolesService.rolesRemove(id);
  }
}
