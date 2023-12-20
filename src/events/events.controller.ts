// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { EventsService } from '@src/events/events.service';
import { EventsDto } from '@src/events/events.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('get_all')
  async eventsGetAll() {
    return await this.eventsService.eventsGetAll();
  }

  @Get('get_one')
  async eventsGetOne(@Body('id') id: number) {
    const result = await this.eventsService.eventsGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async eventsGetMany(@Body('ids') ids: Array<number | string>) {
    const result = await this.eventsService.eventsGetMany(ids);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async eventsFilter(
    @Body('filter') eventsDto: EventsDto,
    @Body('options') optionsDto: OptionsDto,
  ) {
    const result = await this.eventsService.eventsFilter(eventsDto, optionsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async eventsSearch(
    @Body('search') searchDto: SearchDto,
    @Body('options') optionsDto: OptionsDto,
  ) {
    const result = await this.eventsService.eventsSearch(searchDto, optionsDto);
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
