import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/services/common.service';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';
import { RoomsService } from '@src/rooms/rooms.service';

@Injectable()
export class SocketsService {
  constructor(
    @InjectRepository(SocketsEntity)
    private readonly socketsRepository: Repository<SocketsEntity>,
    private readonly roomsService: RoomsService,
  ) {}

  async socketsGetAll(
    relations: Array<string> = undefined,
  ): Promise<SocketsEntity[]> {
    return await this.socketsRepository.find({
      relations,
    });
  }

  async socketsGetOne(
    id: number,
    relations: Array<string> = undefined,
  ): Promise<SocketsEntity> {
    return await this.socketsRepository.findOne({
      relations,
      where: { id },
    });
  }

  async socketsGetMany(
    ids: Array<number | string>,
    relations: Array<string> = undefined,
  ): Promise<SocketsEntity[]> {
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.socketsRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async socketsFilter(
    socketsDto: SocketsDto,
    optionsDto: OptionsDto,
    relations: Array<string> = undefined,
  ): Promise<SocketsFilter[]> {
    const { root } = commonEntityGetParams(SocketsEntity);
    const query = this.socketsRepository.createQueryBuilder(root);
    const where = filterService(socketsDto, root);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async socketsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relations: Array<string> = undefined,
  ): Promise<SocketsFilter[]> {
    const { root, core } = commonEntityGetParams(SocketsEntity);
    const query = this.socketsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
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
