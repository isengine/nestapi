// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesDto } from '@src/categories/categories.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupByDto } from '@src/typeorm/dto/groupBy.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('get_all')
  async categoriesGetAll() {
    return await this.categoriesService.categoriesGetAll();
  }

  @Get('get_one')
  async categoriesGetOne(@Body() categoriesDto: CategoriesDto) {
    const { id } = categoriesDto;
    const result = await this.categoriesService.categoriesGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async categoriesGetMany(@Body() getMany: GetManyDto) {
    const result = await this.categoriesService.categoriesGetMany(getMany);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('find_in')
  async categoriesFindIn(@Body() findInDto: FindInDto) {
    const result = await this.categoriesService.categoriesFindIn(findInDto);
    if (!result) {
      throw new NotFoundException('Any entries not found');
    }
    return result;
  }

  @Get('find_by')
  async categoriesFindBy(@Body() categoriesDto: CategoriesDto) {
    const result = await this.categoriesService.categoriesFindBy(categoriesDto);
    if (!result) {
      throw new NotFoundException('Any entries not found');
    }
    return result;
  }

  @Get('find_last_by')
  async categoriesFindLastBy(@Body() categoriesDto: CategoriesDto) {
    const result = await this.categoriesService.categoriesFindLastBy(
      categoriesDto,
    );
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('group_by')
  async categoriesGroupBy(
    @Body() groupByDto: GroupByDto,
    @Body() categoriesDto: CategoriesDto,
  ) {
    const result = await this.categoriesService.categoriesGroupBy(
      groupByDto,
      categoriesDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async categoriesCreate(@Body() categoriesDto: CategoriesDto) {
    return await this.categoriesService.categoriesCreate(categoriesDto);
  }

  // @Put('update')
  @Post('update')
  async categoriesUpdate(@Body() categoriesDto: CategoriesDto) {
    return await this.categoriesService.categoriesUpdate(categoriesDto);
  }

  // @Delete('remove')
  @Post('remove')
  async categoriesRemove(@Body() id: number) {
    return await this.categoriesService.categoriesRemove(id);
  }
}
