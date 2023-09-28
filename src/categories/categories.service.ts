import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesDto } from '@src/categories/categories.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { findInWhere } from '@src/typeorm/services/findIn.service';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';

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
    const result = await this.categoriesRepository.find({
      relations,
      where: { id: In(idsList) },
    });
    return result;
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
