import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersDto } from '@src/users/users.dto';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/service/common.service';

@Injectable()
export class UsersService extends CommonService<
  UsersEntity,
  UsersDto,
  UsersFilter
> {
  constructor(
    @InjectRepository(UsersEntity)
    protected readonly repository: Repository<UsersEntity>,
  ) {
    super();
  }

  async findByAuthId(
    authId: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersEntity> {
    const user = await this.repository.find({
      relations: relationsDto?.map(i => i.name),
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
    return result;
  }

  async updateByAuthId(
    usersDto: UsersDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<UsersEntity> {
    const authId = usersDto.auth?.id;
    delete usersDto.auth;
    const user = await this.findByAuthId(authId);
    if (!user) {
      return await this.create(
        {
          ...usersDto,
          auth: {
            id: authId,
            username: usersDto.email,
          },
        },
        relationsDto,
      );
    }
    return await this.update(user.id, usersDto, relationsDto);
  }

  async removeByAuthId(authId: number): Promise<boolean> {
    const user = await this.findByAuthId(authId);
    if (!user) {
      return;
    }
    return await this.remove(user.id);
  }
}
