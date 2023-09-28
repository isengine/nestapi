import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { findInWhere } from '@src/typeorm/services/findIn.service';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersDto } from '@src/users/users.dto';
import { PostsService } from '@src/posts/posts.service';

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

  async usersFindIn(findInDto: FindInDto): Promise<UsersEntity[]> {
    const where = findInWhere(findInDto);
    return await this.usersRepository.find({
      relations,
      where,
      order: { id: 'ASC' },
    });
  }

  async usersFindBy(usersDto: UsersDto): Promise<UsersEntity[]> {
    return await this.usersRepository.find({
      relations,
      where: { ...usersDto },
    });
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