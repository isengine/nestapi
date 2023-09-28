// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { TagsService } from '@src/tags/tags.service';
import { TagsDto } from '@src/tags/tags.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('get_all')
  async tagsGetAll() {
    return await this.tagsService.tagsGetAll();
  }

  @Get('get_one')
  async tagsGetOne(@Body() tagsDto: TagsDto) {
    const { id } = tagsDto;
    const result = await this.tagsService.tagsGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async tagsGetMany(@Body() getMany: GetManyDto) {
    const result = await this.tagsService.tagsGetMany(getMany);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('find_in')
  async tagsFindIn(@Body() findInDto: FindInDto) {
    const result = await this.tagsService.tagsFindIn(findInDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('find_by')
  async tagsFindBy(@Body() tagsDto: TagsDto) {
    const result = await this.tagsService.tagsFindBy(tagsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('find_last_by')
  async tagsFindLastBy(@Body() tagsDto: TagsDto) {
    const result = await this.tagsService.tagsFindLastBy(tagsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Post('create')
  async tagsCreate(@Body() tagsDto: TagsDto) {
    return await this.tagsService.tagsCreate(tagsDto);
  }

  // @Put('update')
  @Post('update')
  async tagsUpdate(@Body() tagsDto: TagsDto) {
    return await this.tagsService.tagsUpdate(tagsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async tagsRemove(@Body() id: number) {
    return await this.tagsService.tagsRemove(id);
  }
}
