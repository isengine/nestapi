import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { prepareParams } from '@src/common/service/param_symbol.service';
import { UsersDto } from './users.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService extends CommonService<UsersDto, UsersEntity> {
  constructor(
    @InjectRepository(UsersEntity)
    protected readonly repository: Repository<UsersEntity>,
  ) {
    super();
  }

  async findByHash(hash: string): Promise<UsersEntity> {
    const params: DeepPartial<any> = prepareParams({ hash });
    const query = `
      SELECT ST.*
      FROM users ST
      WHERE LEFT(md5(ST.chat_id), 12) = ${params.hash}
    `;
    const [user] = await this.repository.query(query, [hash]);
    return user;
  }

  async linkToAuth(userId: number, authId: number): Promise<any> {
    const params: DeepPartial<any> = prepareParams({ userId, authId });
    const query = `
      UPDATE users
      SET auth_id = ${params.authId}
      WHERE id = ${params.userId}
    `;
    const updated = await this.repository.query(query, [userId, authId]);
    return updated;
  }
}
