import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionsDto } from '@src/sessions/sessions.dto';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionsEntity)
    private readonly sessionsRepository: Repository<SessionsEntity>,
  ) {}

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
    return await this.sessionsCreate(data);
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

  async sessionsGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SessionsEntity[]> {
    return await this.sessionsRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async sessionsGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SessionsEntity> {
    return await this.sessionsRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async sessionsGetByAuthId(
    authId: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SessionsEntity[]> {
    const sessions = await this.sessionsRepository.find({
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

  async sessionsCreate(sessionsDto: SessionsDto): Promise<SessionsEntity> {
    return await this.sessionsRepository.save({ ...sessionsDto });
  }

  async sessionsUpdate(sessionsDto: SessionsDto): Promise<SessionsEntity> {
    const { id } = sessionsDto;
    if (id === undefined) {
      return;
    }
    delete sessionsDto.createdAt;
    delete sessionsDto.updatedAt;
    return await this.sessionsCreate(sessionsDto);
  }

  async sessionsRemove(id: number): Promise<boolean> {
    const result = await this.sessionsRepository.delete({ id });
    return !!result?.affected;
  }
}
