// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { RoomsService } from '@src/rooms/rooms.service';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('get_all')
  async roomsGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.roomsService.roomsGetAll(relationsDto);
  }

  @Get('get_one')
  async roomsGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.roomsService.roomsGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async roomsGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.roomsService.roomsGetMany(ids, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async roomsFilter(
    @Data('filter') roomsDto: RoomsDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.roomsService.roomsFilter(
      roomsDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async roomsSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.roomsService.roomsSearch(
      searchDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async roomsCreate(@Body() roomsDto: RoomsDto) {
    return await this.roomsService.roomsCreate(roomsDto);
  }

  // @Put('update')
  @Post('update')
  async roomsUpdate(@Body() roomsDto: RoomsDto) {
    return await this.roomsService.roomsUpdate(roomsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async roomsRemove(@Body('id') id: number) {
    return await this.roomsService.roomsRemove(id);
  }
}
