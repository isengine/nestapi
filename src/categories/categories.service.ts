import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesFilter } from '@src/categories/categories.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/services/common.service';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';

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

  async categoriesGetMany(
    ids: Array<number | string>,
  ): Promise<CategoriesEntity[]> {
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.categoriesRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async categoriesFilter(
    categoriesDto: CategoriesDto,
    optionsDto: OptionsDto,
  ): Promise<CategoriesFilter[]> {
    const { root } = commonEntityGetParams(CategoriesEntity);
    const query = this.categoriesRepository.createQueryBuilder(root);
    const where = filterService(categoriesDto, root);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async categoriesSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
  ): Promise<CategoriesFilter[]> {
    const { root, core } = commonEntityGetParams(CategoriesEntity);
    const query = this.categoriesRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
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
