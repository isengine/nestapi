import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';
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
import { RoomsService } from '@src/rooms/rooms.service';

@Injectable()
export class SocketsService {
  constructor(
    @InjectRepository(SocketsEntity)
    private readonly socketsRepository: Repository<SocketsEntity>,
    private readonly roomsService: RoomsService,
  ) {}

  async socketsGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SocketsEntity[]> {
    return await this.socketsRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async socketsGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SocketsEntity> {
    return await this.socketsRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async socketsGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SocketsEntity[]> {
    return await this.socketsRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async socketsFilter(
    socketsDto: SocketsDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SocketsFilter[]> {
    const { root, fields } = commonEntityGetParams(SocketsEntity);
    const query = this.socketsRepository.createQueryBuilder(root);
    const where = filterService(socketsDto, root, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async socketsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<SocketsFilter[]> {
    const { root, core, fields } = commonEntityGetParams(SocketsEntity);
    const query = this.socketsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async socketsCreate(socketsDto: SocketsDto): Promise<SocketsEntity> {
    const { roomId } = socketsDto;
    if (roomId) {
      const room = await this.roomsService.roomsGetOne(roomId);
      socketsDto.room = room;
    }
    delete socketsDto.roomId;
    delete socketsDto.createdAt;
    delete socketsDto.updatedAt;
    return await this.socketsRepository.save({ ...socketsDto });
  }

  async socketsUpdate(socketsDto: SocketsDto): Promise<SocketsEntity> {
    const { id } = socketsDto;
    if (id === undefined) {
      return;
    }
    return await this.socketsCreate(socketsDto);
  }

  async socketsRemove(id: number): Promise<boolean> {
    const result = await this.socketsRepository.delete({ id });
    return !!result?.affected;
  }
}
