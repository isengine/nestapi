import { Controller, Get, NotFoundException } from '@nestjs/common';
import { SessionsDto } from '@src/sessions/sessions.dto';
import { SessionsService } from '@src/sessions/sessions.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/common/common.decorator';
import { CommonController } from '@src/common/common.controller';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { SessionsFilter } from '@src/sessions/sessions.filter';

@Controller('sessions')
export class SessionsController extends CommonController(
  'Сессии',
  SessionsEntity,
  SessionsDto,
)<
  SessionsService,
  SessionsEntity,
  SessionsDto,
  SessionsFilter
> {
  constructor(
    readonly service: SessionsService,
  ) {
    super();
  }

  @Get('get_by_auth_id')
  async sessionsGetByAuthId(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.service.sessionsGetByAuthId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }
}
