// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { RoomsService } from '@src/rooms/rooms.service';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('get_all')
  async roomsGetAll(@Data('relations') relations: Array<string>) {
    return await this.roomsService.roomsGetAll(relations);
  }

  @Get('get_one')
  async roomsGetOne(
    @Data('id') id: number,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.roomsService.roomsGetOne(id, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async roomsGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.roomsService.roomsGetMany(ids, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async roomsFilter(
    @Data('filter') roomsDto: RoomsDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.roomsService.roomsFilter(
      roomsDto,
      optionsDto,
      relations,
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
    @Data('relations') relations: Array<string>,
  ) {
    const result = await this.roomsService.roomsSearch(
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
  async roomsCreate(@Body('create') roomsDto: RoomsDto) {
    return await this.roomsService.roomsCreate(roomsDto);
  }

  // @Put('update')
  @Post('update')
  async roomsUpdate(@Body('update') roomsDto: RoomsDto) {
    return await this.roomsService.roomsUpdate(roomsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async roomsRemove(@Body('id') id: number) {
    return await this.roomsService.roomsRemove(id);
  }
}
