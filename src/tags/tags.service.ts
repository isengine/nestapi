import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';

const relations = ['posts'];

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
  ) {}

  async tagsGetAll(): Promise<TagsEntity[]> {
    return await this.tagsRepository.find({
      relations,
    });
  }

  async tagsGetOne(id: number): Promise<TagsEntity> {
    return await this.tagsRepository.findOne({
      relations,
      where: { id },
    });
  }

  async tagsGetMany(getMany: GetManyDto): Promise<TagsEntity[]> {
    const { ids } = getMany;
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.tagsRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async tagsFilter(
    tagsDto: TagsDto,
    optionsDto: OptionsDto,
  ): Promise<TagsFilter[]> {
    const where = filterService(tagsDto);
    const options = {
      relations,
      where,
      order: undefined,
      skip: undefined,
      take: undefined,
    };
    return await optionsService(this.tagsRepository, optionsDto, options);
  }

  async tagsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
  ): Promise<TagsFilter[]> {
    const where = searchService(searchDto, TagsEntity);
    const options = {
      relations,
      where,
      order: undefined,
      skip: undefined,
      take: undefined,
    };
    return await optionsService(this.tagsRepository, optionsDto, options);
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
    await this.tagsCreate(tagsDto);
    return await this.tagsGetOne(tagsDto.id);
  }

  async tagsRemove(id: number): Promise<boolean> {
    const result = await this.tagsRepository.delete({ id });
    return !!result?.affected;
  }
}
