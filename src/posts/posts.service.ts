import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { findInWhere } from '@src/typeorm/services/findIn.service';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsDto } from '@src/posts/posts.dto';
import { CategoriesService } from '@src/categories/categories.service';
import { TagsService } from '@src/tags/tags.service';

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

  async postsFindIn(findInDto: FindInDto): Promise<PostsEntity[]> {
    const where = findInWhere(findInDto);
    return await this.postsRepository.find({
      relations,
      where,
      order: { id: 'ASC' },
    });
  }

  async postsFindBy(postsDto: PostsDto): Promise<PostsEntity[]> {
    return await this.postsRepository.find({
      relations,
      where: { ...postsDto },
    });
  }

  async postsFindLastBy(postsDto: PostsDto): Promise<PostsEntity> {
    const result = await this.postsRepository.find({
      relations,
      where: { ...postsDto },
      order: { id: 'DESC' },
      take: 1,
    });
    return result[0];
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
