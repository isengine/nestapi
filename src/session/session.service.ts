import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionDto } from '@src/session/session.dto';
import { SessionEntity } from '@src/session/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async sessionGetAll(
    relations: Array<string> = undefined,
  ): Promise<SessionEntity[]> {
    return await this.sessionRepository.find({
      relations,
    });
  }

  async sessionGetOne(
    id: number,
    relations: Array<string> = undefined,
  ): Promise<SessionEntity> {
    return await this.sessionRepository.findOne({
      relations,
      where: { id },
    });
  }

  async sessionGetByAuthId(
    authId: number,
    relations: Array<string> = undefined,
  ): Promise<SessionEntity[]> {
    const session = await this.sessionRepository.find({
      relations,
      where: {
        auth: {
          id: authId,
        },
      },
    });
    if (!session || !session.length) {
      return;
    }
    return session;
  }

  async sessionCreate(sessionDto: SessionDto): Promise<SessionEntity> {
    return await this.sessionRepository.save({ ...sessionDto });
  }

  async sessionUpdate(sessionDto: SessionDto): Promise<SessionEntity> {
    const { id } = sessionDto;
    if (id === undefined) {
      return;
    }
    delete sessionDto.createdAt;
    delete sessionDto.updatedAt;
    return await this.sessionCreate(sessionDto);
  }

  async sessionRemove(id: number): Promise<boolean> {
    const result = await this.sessionRepository.delete({ id });
    return !!result?.affected;
  }
}
