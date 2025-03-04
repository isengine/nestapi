import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { AuthSessionsDto } from './auth_sessions.dto';
import { AuthSessionsEntity } from './auth_sessions.entity';

@Injectable()
export class AuthSessionsService extends CommonService<
  AuthSessionsDto,
  AuthSessionsEntity
> {
  constructor(
    @InjectRepository(AuthSessionsEntity)
    protected readonly repository: Repository<AuthSessionsEntity>,
  ) {
    super();
  }

  async log(auth, request, description = '') {
    const { ip, method, originalUrl, headers } = request;
    const data = {
      ip,
      userAgent: headers['user-agent'],
      referrer: originalUrl,
      method,
      locale:
        headers['accept-language']?.split(',')?.[0]?.split(';')?.[0] || null,
      timezone: headers['timezone'],
      auth,
      description,
    };
    return await this.create(data, [{ name: 'auth' }]);
  }

  async start(auth, request) {
    const { session } = request;
    if (!session) {
      return;
    }
    session.save(async (e) => {
      await this.log(auth, request, e ? 'create error' : 'create');
    });
  }

  async destroy(auth, request) {
    const { session } = request;
    if (session) {
      await session.destroy(async (e) => {
        await this.log(auth, request, e ? 'destroy error' : 'destroy');
      });
    }
  }

  async getByAuthId(
    authId: number,
    relations: Array<RelationsDto> = undefined,
  ): Promise<AuthSessionsEntity[]> {
    const sessions = await this.repository.find({
      relations: relations?.map((i) => i.name),
      where: {
        auth: {
          id: authId,
        },
      },
    });
    if (!sessions || !sessions.length) {
      return;
    }
    return sessions;
  }
}
