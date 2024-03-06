import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/service/common.service';
import { filterService } from '@src/typeorm/service/filter.service';
import { optionsService } from '@src/typeorm/service/options.service';
import { searchService } from '@src/typeorm/service/search.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async usersGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersEntity[]> {
    return await this.usersRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async usersGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async usersGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersEntity[]> {
    return await this.usersRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async usersGetByAuthId(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: {
        auth: {
          id,
        },
      },
      take: 1,
    });
    if (!user || !user.length) {
      return;
    }
    const result = user[0];
    // result.auth = undefined;
    return result;
  }

  async usersFilter(
    usersDto: UsersDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersFilter[]> {
    const { root, fields } = commonEntityGetParams(UsersEntity);
    const query = this.usersRepository.createQueryBuilder(root);
    const where = filterService(usersDto, root, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async usersSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersFilter[]> {
    const { root, core, fields } = commonEntityGetParams(UsersEntity);
    const query = this.usersRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async usersCreate(usersDto: UsersDto): Promise<UsersEntity> {
    delete usersDto.createdAt;
    delete usersDto.updatedAt;
    return await this.usersRepository.save({ ...usersDto });
  }

  async usersUpdate(usersDto: UsersDto): Promise<UsersEntity> {
    const { id } = usersDto;
    if (id === undefined) {
      return;
    }
    return await this.usersCreate(usersDto);
  }

  async usersUpdateByAuthId(usersDto: UsersDto): Promise<UsersEntity> {
    const { authId } = usersDto;
    delete usersDto.authId;
    const user = await this.usersGetByAuthId(authId);
    if (!user) {
      return await this.usersCreate({
        ...usersDto,
        auth: {
          id: authId,
          username: usersDto.email,
        },
      });
    }
    usersDto.id = user.id;
    return await this.usersUpdate(usersDto);
  }

  async usersRemove(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });
    return !!result?.affected;
  }

  async usersRemoveByAuthId(authId: number): Promise<boolean> {
    const user = await this.usersGetByAuthId(authId);
    if (!user) {
      return;
    }
    return await this.usersRemove(user.id);
  }
}
