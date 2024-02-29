// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { SocketsService } from '@src/sockets/sockets.service';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('sockets')
export class SocketsController {
  constructor(private readonly socketsService: SocketsService) {}

  @Get('get_all')
  async socketsGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.socketsService.socketsGetAll(relationsDto);
  }

  @Get('get_one')
  async socketsGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.socketsService.socketsGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async socketsGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.socketsService.socketsGetMany(ids, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async socketsFilter(
    @Data('filter') socketsDto: SocketsDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.socketsService.socketsFilter(
      socketsDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async socketsSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.socketsService.socketsSearch(
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
  async socketsCreate(@Body() socketsDto: SocketsDto) {
    return await this.socketsService.socketsCreate(socketsDto);
  }

  // @Put('update')
  @Post('update')
  async socketsUpdate(@Body() socketsDto: SocketsDto) {
    return await this.socketsService.socketsUpdate(socketsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async socketsRemove(@Body('id') id: number) {
    return await this.socketsService.socketsRemove(id);
  }
}
