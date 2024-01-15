// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { EventsThemesService } from '@src/events.themes/events.themes.service';
import { EventsThemesDto } from '@src/events.themes/events.themes.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Controller('events_themes')
export class EventsThemesController {
  constructor(private readonly eventsThemesService: EventsThemesService) {}

  @Get('get_all')
  async eventsThemesGetAll(@Body('relations') relations: Array<string>) {
    return await this.eventsThemesService.eventsThemesGetAll(relations);
  }

  @Get('get_one')
  async eventsThemesGetOne(
    @Body('id') id: number,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.eventsThemesService.eventsThemesGetOne(
      id,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async eventsThemesGetMany(
    @Body('ids') ids: Array<number | string>,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.eventsThemesService.eventsThemesGetMany(
      ids,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async eventsThemesFilter(
    @Body('filter') eventsThemesDto: EventsThemesDto,
    @Body('options') optionsDto: OptionsDto,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.eventsThemesService.eventsThemesFilter(
      eventsThemesDto,
      optionsDto,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async eventsThemesSearch(
    @Body('search') searchDto: SearchDto,
    @Body('options') optionsDto: OptionsDto,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.eventsThemesService.eventsThemesSearch(
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
  async eventsThemesCreate(@Body('create') eventsThemesDto: EventsThemesDto) {
    return await this.eventsThemesService.eventsThemesCreate(eventsThemesDto);
  }

  // @Put('update')
  @Post('update')
  async eventsThemesUpdate(@Body('update') eventsThemesDto: EventsThemesDto) {
    return await this.eventsThemesService.eventsThemesUpdate(eventsThemesDto);
  }

  // @Delete('remove')
  @Post('remove')
  async eventsThemesRemove(@Body('id') id: number) {
    return await this.eventsThemesService.eventsThemesRemove(id);
  }
}
