import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';
import { CategoriesService } from '@src/categories/categories.service';
import { TagsService } from '@src/tags/tags.service';
import { CommonService } from '@src/common/service/common.service';
import { RelationsDto } from '@src/common/dto/relations.dto';

@Injectable()
export class PostsService extends CommonService<
  PostsEntity,
  PostsDto,
  PostsFilter
> {
  constructor(
    @InjectRepository(PostsEntity)
    protected readonly repository: Repository<PostsEntity>,
    protected readonly categoriesService: CategoriesService,
    protected readonly tagsService: TagsService,
  ) {
    super();
  }

  async create(
    postsDto: PostsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<PostsEntity> {
    const { categoryId } = postsDto;
    if (categoryId) {
      const category = await this.categoriesService.findOne(
        categoryId,
      );
      postsDto.category = category;
    }
    delete postsDto.categoryId;
    const { tagsList } = postsDto;
    if (tagsList && tagsList.length) {
      const tags = await this.tagsService.findMany(tagsList);
      postsDto.tags = (postsDto.tags || []).concat(tags);
    }
    delete postsDto.tagsList;
    return await super.create(postsDto, relationsDto);
  }
}
