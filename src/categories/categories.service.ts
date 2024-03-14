import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesFilter } from '@src/categories/categories.filter';
import { CommonService } from '@src/common/service/common.service';

@Injectable()
export class CategoriesService extends CommonService<
  CategoriesEntity,
  CategoriesDto,
  CategoriesFilter
> {
  constructor(
    @InjectRepository(CategoriesEntity)
    protected readonly repository: Repository<CategoriesEntity>,
  ) {
    super();
  }
}
