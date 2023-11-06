import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsGroup } from '@src/tags/tags.group';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { findCreate } from '@src/typeorm/services/find.service';
import { groupService } from '@src/typeorm/services/group.service';
import { relationsCreate } from '@src/typeorm/services/relations.service';
import { searchCreate } from '@src/typeorm/services/search.service';

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

  async tagsFind(
    tagsDto: TagsDto,
    findDto?: FindDto,
  ): Promise<TagsEntity[]> {
    const root = 'tags';
    const query = this.tagsRepository.createQueryBuilder(root);
    relationsCreate(query, relations, root);
    findCreate(query, tagsDto, findDto, root);
    return await query.getMany();
  }

  async tagsGroup(
    groupDto: GroupDto,
    tagsDto?: TagsDto,
  ): Promise<TagsGroup[]> {
    const result = await this.tagsRepository.find({
      relations,
      where: tagsDto ? { ...tagsDto } : undefined,
      order: { [groupDto.field]: groupDto.sort || 'DESC' },
    });
    return await groupService(result, groupDto);
  }

  async tagsSearch(searchDto: SearchDto): Promise<TagsEntity[]> {
    const root = 'tags';
    const where = searchCreate(searchDto, root);
    const query = this.tagsRepository.createQueryBuilder(root);
    relationsCreate(query, relations, root);
    return await query.where(where).orderBy(`${root}.id`, 'ASC').getMany();
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
