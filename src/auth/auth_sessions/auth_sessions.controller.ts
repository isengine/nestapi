import { Controller, Get, NotFoundException } from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/common/common.decorator';
import { CommonController } from '@src/common/common.controller';
import { AuthSessionsDto } from './auth_sessions.dto';
import { AuthSessionsEntity } from './auth_sessions.entity';
import { AuthSessionsService } from './auth_sessions.service';

@Controller('auth/sessions')
export class AuthSessionsController extends CommonController(
  'Сессии',
  AuthSessionsDto,
  AuthSessionsEntity,
)<AuthSessionsDto, AuthSessionsEntity, AuthSessionsService> {
  constructor(readonly service: AuthSessionsService) {
    super();
  }

  @Get('get_by_auth_id')
  async getByAuthId(
    @Data('id') id: number,
    @Data('relations') relations: Array<RelationsDto>,
  ) {
    const result = await this.service.getByAuthId(id, relations);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }
}
