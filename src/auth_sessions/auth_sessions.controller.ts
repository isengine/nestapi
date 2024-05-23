import { Controller, Get, NotFoundException } from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/common/common.decorator';
import { CommonController } from '@src/common/common.controller';
import { AuthSessionsDto } from '@src/auth_sessions/auth_sessions.dto';
import { AuthSessionsService } from '@src/auth_sessions/auth_sessions.service';
import { AuthSessionsEntity } from '@src/auth_sessions/auth_sessions.entity';
import { AuthSessionsFilter } from '@src/auth_sessions/auth_sessions.filter';

@Controller('auth/sessions')
export class AuthSessionsController extends CommonController(
  'Сессии',
  AuthSessionsEntity,
  AuthSessionsDto,
)<
  AuthSessionsService,
  AuthSessionsEntity,
  AuthSessionsDto,
  AuthSessionsFilter
> {
  constructor(
    readonly service: AuthSessionsService,
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
