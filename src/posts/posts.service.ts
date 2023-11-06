import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsGroup } from '@src/posts/posts.group';
import { CategoriesService } from '@src/categories/categories.service';
import { TagsService } from '@src/tags/tags.service';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { findCreate } from '@src/typeorm/services/find.service';
import { groupService } from '@src/typeorm/services/group.service';
import { relationsCreate } from '@src/typeorm/services/relations.service';
import { searchCreate } from '@src/typeorm/services/search.service';

const relations = ['category', 'tags'];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoriesService: CategoriesService,
    private readonly tagsService: TagsService,
  ) {}

  async postsGetAll(): Promise<PostsEntity[]> {
    return await this.postsRepository.find({
      relations,
    });
  }

  async postsGetOne(id: number): Promise<PostsEntity> {
    return await this.postsRepository.findOne({
      relations,
      where: { id },
    });
  }

  async postsGetMany(getMany: GetManyDto): Promise<PostsEntity[]> {
    const { ids } = getMany;
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.postsRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async postsFind(
    postsDto: PostsDto,
    findDto?: FindDto,
  ): Promise<PostsEntity[]> {
    const root = 'posts';
    const query = this.postsRepository.createQueryBuilder(root);
    relationsCreate(query, relations, root);
    findCreate(query, postsDto, findDto, root);
    return await query.getMany();
  }

  async postsGroup(
    groupDto: GroupDto,
    postsDto?: PostsDto,
  ): Promise<PostsGroup[]> {
    const result = await this.postsRepository.find({
      relations,
      where: postsDto ? { ...postsDto } : undefined,
      order: { [groupDto.field]: groupDto.sort || 'DESC' },
    });
    return await groupService(result, groupDto);
  }

  async postsSearch(searchDto: SearchDto): Promise<PostsEntity[]> {
    const root = 'posts';
    const where = searchCreate(searchDto, root);
    const query = this.postsRepository.createQueryBuilder(root);
    relationsCreate(query, relations, root);
    return await query.where(where).orderBy(`${root}.id`, 'ASC').getMany();
  }

  async postsCreate(postsDto: PostsDto): Promise<PostsEntity> {
    const { categoryId } = postsDto;
    if (categoryId) {
      const category = await this.categoriesService.categoriesGetOne(
        categoryId,
      );
      postsDto.category = category;
    }
    delete postsDto.categoryId;
    const { tagsList } = postsDto;
    if (tagsList && tagsList.length) {
      const tags = await this.tagsService.tagsGetMany({ ids: tagsList });
      postsDto.tags = (postsDto.tags || []).concat(tags);
    }
    delete postsDto.tagsList;
    delete postsDto.createdAt;
    delete postsDto.updatedAt;
    return await this.postsRepository.save({ ...postsDto });
  }

  async postsUpdate(postsDto: PostsDto): Promise<PostsEntity> {
    const { id } = postsDto;
    if (id === undefined) {
      return;
    }
    await this.postsCreate(postsDto);
    return await this.postsGetOne(postsDto.id);
  }

  async postsRemove(id: number): Promise<boolean> {
    const result = await this.postsRepository.delete({ id });
    return !!result?.affected;
  }
}
