// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException, Req } from '@nestjs/common';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsDto } from '@src/clients/clients.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';
import { Client, SelfClient } from '@src/clients/clients.decorator';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('register')
  async clientsRegister(@Body() clientsDto: ClientsDto) {
    return await this.clientsService.clientsRegister(clientsDto);
  }

  @Client()
  @Get('self')
  async clientsSelfGet(@SelfClient() id: number) {
    const result = await this.clientsService.clientsGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Client()
  @Post('self')
  async clientsSelfPost(@SelfClient() id: number) {
    const result = await this.clientsService.clientsGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Client()
  @Get('get_all')
  async clientsGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.clientsService.clientsGetAll(relationsDto);
  }

  @Client()
  @Get('get_one')
  async clientsGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.clientsService.clientsGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async clientsGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.clientsService.clientsGetMany(ids, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async clientsFilter(
    @Data('filter') clientsDto: ClientsDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.clientsService.clientsFilter(
      clientsDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async clientsSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.clientsService.clientsSearch(
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
  async clientsCreate(@Body() clientsDto: ClientsDto) {
    return await this.clientsService.clientsCreate(clientsDto);
  }

  // @Put('update')
  @Post('update')
  async clientsUpdate(@Body() clientsDto: ClientsDto) {
    return await this.clientsService.clientsUpdate(clientsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async clientsRemove(@Body('id') id: number) {
    return await this.clientsService.clientsRemove(id);
  }
}
