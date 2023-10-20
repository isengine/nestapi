import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesSearch } from '@src/categories/categories.search';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupByDto } from '@src/typeorm/dto/groupBy.dto';
import { findInWhere } from '@src/typeorm/services/findIn.service';
import { groupByField } from '@src/typeorm/services/groupBy.service';

const relations = ['posts'];

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  async categoriesGetAll(): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find({
      relations,
    });
  }

  async categoriesGetOne(id: number): Promise<CategoriesEntity> {
    return await this.categoriesRepository.findOne({
      relations,
      where: { id },
    });
  }

  async categoriesGetMany(getMany: GetManyDto): Promise<CategoriesEntity[]> {
    const { ids } = getMany;
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.categoriesRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async categoriesFindIn(findInDto: FindInDto): Promise<CategoriesEntity[]> {
    const where = findInWhere(findInDto);
    return await this.categoriesRepository.find({
      relations,
      where,
      order: { id: 'ASC' },
    });
  }

  async categoriesFindBy(
    categoriesDto: CategoriesDto,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find({
      relations,
      where: { ...categoriesDto },
    });
  }

  async categoriesFindLastBy(
    categoriesDto: CategoriesDto,
  ): Promise<CategoriesEntity> {
    const result = await this.categoriesRepository.find({
      relations,
      where: { ...categoriesDto },
      order: { id: 'DESC' },
      take: 1,
    });
    return result[0];
  }

  async categoriesGroupBy(
    groupByDto: GroupByDto,
    categoriesDto?: CategoriesDto,
  ): Promise<CategoriesSearch[]> {
    const result = await this.categoriesRepository.find({
      relations,
      where: categoriesDto ? { ...categoriesDto } : undefined,
      order: { id: 'DESC' },
    });
    return await groupByField(result, groupByDto);
  }

  async categoriesCreate(
    categoriesDto: CategoriesDto,
  ): Promise<CategoriesEntity> {
    delete categoriesDto.createdAt;
    delete categoriesDto.updatedAt;
    return await this.categoriesRepository.save({ ...categoriesDto });
  }

  async categoriesUpdate(
    categoriesDto: CategoriesDto,
  ): Promise<CategoriesEntity> {
    const { id } = categoriesDto;
    if (id === undefined) {
      return;
    }
    await this.categoriesCreate(categoriesDto);
    return await this.categoriesGetOne(categoriesDto.id);
  }

  async categoriesRemove(id: number): Promise<boolean> {
    const result = await this.categoriesRepository.delete({ id });
    return !!result?.affected;
  }
}
