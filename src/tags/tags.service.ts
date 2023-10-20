import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsSearch } from '@src/tags/tags.search';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupByDto } from '@src/typeorm/dto/groupBy.dto';
import { findInWhere } from '@src/typeorm/services/findIn.service';
import { groupByField } from '@src/typeorm/services/groupBy.service';

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

  async tagsFindIn(findInDto: FindInDto): Promise<TagsEntity[]> {
    const where = findInWhere(findInDto);
    return await this.tagsRepository.find({
      relations,
      where,
      order: { id: 'ASC' },
    });
  }

  async tagsFindBy(tagsDto: TagsDto): Promise<TagsEntity[]> {
    return await this.tagsRepository.find({
      relations,
      where: { ...tagsDto },
    });
  }

  async tagsFindLastBy(tagsDto: TagsDto): Promise<TagsEntity> {
    const result = await this.tagsRepository.find({
      relations,
      where: { ...tagsDto },
      order: { id: 'DESC' },
      take: 1,
    });
    return result[0];
  }

  async tagsGroupBy(
    groupByDto: GroupByDto,
    tagsDto?: TagsDto,
  ): Promise<TagsSearch[]> {
    const result = await this.tagsRepository.find({
      relations,
      where: tagsDto ? { ...tagsDto } : undefined,
      order: { id: 'DESC' },
    });
    return await groupByField(result, groupByDto);
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
