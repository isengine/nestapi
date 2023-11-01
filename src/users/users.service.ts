import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersGroup } from '@src/users/users.group';
import { PostsService } from '@src/posts/posts.service';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';
import { findCreate } from '@src/typeorm/services/find.service';
import { findInWhere } from '@src/typeorm/services/findIn.service';
import { groupService } from '@src/typeorm/services/group.service';
import { relationsCreate } from '@src/typeorm/services/relations.service';

const relations = ['auth', 'posts'];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly postsService: PostsService,
  ) {}

  async usersGetAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find({
      relations,
    });
  }

  async usersGetOne(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      relations,
      where: { id },
    });
  }

  async usersGetMany(getMany: GetManyDto): Promise<UsersEntity[]> {
    const { ids } = getMany;
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.usersRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async usersGetByAuthId(authId: number): Promise<UsersEntity> {
    const user = await this.usersRepository.find({
      relations,
      where: {
        auth: {
          id: authId,
        },
      },
      take: 1,
    });
    if (!user || !user.length) {
      return;
    }
    const result = user[0];
    result.auth = undefined;
    return result;
  }

  async usersFind(
    usersDto: UsersDto,
    findDto?: FindDto,
  ): Promise<UsersEntity[]> {
    const root = 'users';
    const query = this.usersRepository.createQueryBuilder(root);
    relationsCreate(query, relations, root);
    findCreate(query, usersDto, findDto, root);
    return await query.getMany();
  }

  async usersFindIn(findInDto: FindInDto): Promise<UsersEntity[]> {
    const root = 'users';
    const where = findInWhere(findInDto, root);
    const query = this.usersRepository.createQueryBuilder(root);
    relationsCreate(query, relations, root);
    return await query.where(where).orderBy(`${root}.id`, 'ASC').getMany();
  }

  async usersFindLastBy(usersDto: UsersDto): Promise<UsersEntity> {
    const result = await this.usersRepository.find({
      relations,
      where: { ...usersDto },
      order: { id: 'DESC' },
      take: 1,
    });
    return result[0];
  }

  async usersGroup(
    groupDto: GroupDto,
    usersDto?: UsersDto,
  ): Promise<UsersGroup[]> {
    const result = await this.usersRepository.find({
      relations,
      where: usersDto ? { ...usersDto } : undefined,
      order: { [groupDto.field]: groupDto.sort || 'DESC' },
    });
    return await groupService(result, groupDto);
  }

  async usersCreate(usersDto: UsersDto): Promise<UsersEntity> {
    const { postsList } = usersDto;
    if (postsList && postsList.length) {
      const posts = await this.postsService.postsGetMany({ ids: postsList });
      usersDto.posts = (usersDto.posts || []).concat(posts);
    }
    delete usersDto.postsList;
    delete usersDto.createdAt;
    delete usersDto.updatedAt;
    return await this.usersRepository.save({ ...usersDto });
  }

  async usersUpdate(usersDto: UsersDto): Promise<UsersEntity> {
    const { id } = usersDto;
    if (id === undefined) {
      return;
    }
    await this.usersCreate(usersDto);
    return await this.usersGetOne(usersDto.id);
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
          login: usersDto.email,
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
