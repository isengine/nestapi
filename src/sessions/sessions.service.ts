import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionsDto } from '@src/sessions/sessions.dto';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/service/common.service';
import { SessionsFilter } from './sessions.filter';

@Injectable()
export class SessionsService extends CommonService<
  SessionsEntity,
  SessionsDto,
  SessionsFilter
> {
  constructor(
    @InjectRepository(SessionsEntity)
    protected readonly repository: Repository<SessionsEntity>,
  ) {
    super();
  }

  async logSessions(auth, tokens, request, description = '') {
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
      access_token: tokens?.access_token || null,
      refresh_token: tokens?.refresh_token || null,
    };
    return await this.create(data);
  }

  async createSession(auth, tokens, request) {
    const { refresh_token } = tokens;
    const { session } = request;
    // console.log('-- session create', session);
    if (!session) {
      return;
    }
    session.token = refresh_token;
    session.save(async (e) => {
      await this.logSessions(auth, tokens, request, e ? 'create error' : 'create');
    });
    // console.log('-- session save', session);
  }

  async destroySession(auth, request) {
    const { session } = request;
    if (session) {
      await session.destroy(async (e) => {
        await this.logSessions(auth, null, request, e ? 'destroy error' : 'destroy');
      });
    }
  }

  async sessionsGetByAuthId(
    authId: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SessionsEntity[]> {
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
