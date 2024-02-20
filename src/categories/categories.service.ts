import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesFilter } from '@src/categories/categories.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/services/common.service';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  async categoriesGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async categoriesGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<CategoriesEntity> {
    return await this.categoriesRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async categoriesGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async categoriesFilter(
    categoriesDto: CategoriesDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<CategoriesFilter[]> {
    const { root } = commonEntityGetParams(CategoriesEntity);
    const query = this.categoriesRepository.createQueryBuilder(root);
    const where = filterService(categoriesDto, root);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async categoriesSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<CategoriesFilter[]> {
    const { root, core } = commonEntityGetParams(CategoriesEntity);
    const query = this.categoriesRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
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
    return await this.categoriesCreate(categoriesDto);
  }

  async categoriesRemove(id: number): Promise<boolean> {
    const result = await this.categoriesRepository.delete({ id });
    return !!result?.affected;
  }
}
