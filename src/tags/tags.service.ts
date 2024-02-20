import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';
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
export class TagsService {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
  ) {}

  async tagsGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TagsEntity[]> {
    return await this.tagsRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async tagsGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TagsEntity> {
    return await this.tagsRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async tagsGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TagsEntity[]> {
    return await this.tagsRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async tagsFilter(
    tagsDto: TagsDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TagsFilter[]> {
    const { root } = commonEntityGetParams(TagsEntity);
    const query = this.tagsRepository.createQueryBuilder(root);
    const where = filterService(tagsDto, root);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async tagsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TagsFilter[]> {
    const { root, core } = commonEntityGetParams(TagsEntity);
    const query = this.tagsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async tagsCreate(tagsDto: TagsDto): Promise<TagsEntity> {
    delete tagsDto.createdAt;
    delete tagsDto.updatedAt;
    return await this.tagsRepository.save({ ...tagsDto });
  }

  async tagsUpdate(tagsDto: TagsDto): Promise<TagsEntity> {
    const { id } = tagsDto;
    if (id === undefined) {
      return;
    }
    delete tagsDto.createdAt;
    delete tagsDto.updatedAt;
    return await this.tagsCreate(tagsDto);
  }

  async tagsRemove(id: number): Promise<boolean> {
    const result = await this.tagsRepository.delete({ id });
    return !!result?.affected;
  }
}
