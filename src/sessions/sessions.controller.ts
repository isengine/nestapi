import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { SessionsDto } from '@src/sessions/sessions.dto';
import { SessionsService } from '@src/sessions/sessions.service';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { Data } from '@src/app.decorator';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('get_all')
  async sessionsGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.sessionsService.sessionsGetAll(relationsDto);
  }

  @Get('get_one')
  async sessionsGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.sessionsService.sessionsGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('get_by_auth_id')
  async sessionsGetByAuthId(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.sessionsService.sessionsGetByAuthId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async sessionsCreate(@Body('create') sessionsDto: SessionsDto) {
    return await this.sessionsService.sessionsCreate(sessionsDto);
  }

  // @Put('update')
  @Post('update')
  async sessionsUpdate(@Body('update') sessionsDto: SessionsDto) {
    return await this.sessionsService.sessionsUpdate(sessionsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async sessionsRemove(@Body('id') id: number) {
    return await this.sessionsService.sessionsRemove(id);
  }
}
