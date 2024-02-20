// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { TagsService } from '@src/tags/tags.service';
import { TagsDto } from '@src/tags/tags.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('get_all')
  async tagsGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.tagsService.tagsGetAll(relationsDto);
  }

  @Get('get_one')
  async tagsGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tagsService.tagsGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async tagsGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tagsService.tagsGetMany(ids, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async tagsFilter(
    @Data('filter') tagsDto: TagsDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tagsService.tagsFilter(
      tagsDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async tagsSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tagsService.tagsSearch(
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
  async tagsCreate(@Body('create') tagsDto: TagsDto) {
    return await this.tagsService.tagsCreate(tagsDto);
  }

  // @Put('update')
  @Post('update')
  async tagsUpdate(@Body('update') tagsDto: TagsDto) {
    return await this.tagsService.tagsUpdate(tagsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async tagsRemove(@Body('id') id: number) {
    return await this.tagsService.tagsRemove(id);
  }
}
