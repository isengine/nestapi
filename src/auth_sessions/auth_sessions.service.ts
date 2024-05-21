import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { AuthSessionsDto } from '@src/auth_sessions/auth_sessions.dto';
import { AuthSessionsEntity } from '@src/auth_sessions/auth_sessions.entity';
import { AuthSessionsFilter } from '@src/auth_sessions/auth_sessions.filter';

@Injectable()
export class AuthSessionsService extends CommonService<
  AuthSessionsEntity,
  AuthSessionsDto,
  AuthSessionsFilter
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
    return await this.create(data);
  }

  async start(auth, token, request) {
    const { refresh_token } = token;
    const { session } = request;
    // console.log('-- session create', session);
    if (!session) {
      return;
    }
    session.token = refresh_token;
    session.save(async (e) => {
      await this.log(auth, request, e ? 'create error' : 'create');
    });
    // console.log('-- session save', session);
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
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<AuthSessionsEntity[]> {
    const sessions = await this.repository.find({
      relations: relationsDto?.map(i => i.name),
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
