// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { EventsService } from '@src/events/events.service';
import { EventsDto } from '@src/events/events.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('get_all')
  async eventsGetAll(@Data('relations') relations: Array<string>) {
    return await this.eventsService.eventsGetAll(relations);
  }

  @Get('get_one')
  async eventsGetOne(
    @Data('id') id: number,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.eventsService.eventsGetOne(id, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async eventsGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.eventsService.eventsGetMany(ids, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async eventsFilter(
    @Data('filter') eventsDto: EventsDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.eventsService.eventsFilter(
      eventsDto,
      optionsDto,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async eventsSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.eventsService.eventsSearch(
      searchDto,
      optionsDto,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async eventsCreate(@Body('create') eventsDto: EventsDto) {
    return await this.eventsService.eventsCreate(eventsDto);
  }

  // @Put('update')
  @Post('update')
  async eventsUpdate(@Body('update') eventsDto: EventsDto) {
    return await this.eventsService.eventsUpdate(eventsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async eventsRemove(@Body('id') id: number) {
    return await this.eventsService.eventsRemove(id);
  }
}
