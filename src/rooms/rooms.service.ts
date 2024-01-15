import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { RoomsFilter } from '@src/rooms/rooms.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/services/common.service';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsEntity)
    private readonly roomsRepository: Repository<RoomsEntity>,
  ) {}

  async roomsGetAll(
    relations: Array<string> = undefined,
  ): Promise<RoomsEntity[]> {
    return await this.roomsRepository.find({
      relations,
    });
  }

  async roomsGetOne(
    id: number,
    relations: Array<string> = undefined,
  ): Promise<RoomsEntity> {
    return await this.roomsRepository.findOne({
      relations,
      where: { id },
    });
  }

  async roomsGetMany(
    ids: Array<number | string>,
    relations: Array<string> = undefined,
  ): Promise<RoomsEntity[]> {
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.roomsRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async roomsFilter(
    roomsDto: RoomsDto,
    optionsDto: OptionsDto,
    relations: Array<string> = undefined,
  ): Promise<RoomsFilter[]> {
    const { root } = commonEntityGetParams(RoomsEntity);
    const query = this.roomsRepository.createQueryBuilder(root);
    const where = filterService(roomsDto, root);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async roomsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relations: Array<string> = undefined,
  ): Promise<RoomsFilter[]> {
    const { root, core } = commonEntityGetParams(RoomsEntity);
    const query = this.roomsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async roomsCreate(roomsDto: RoomsDto): Promise<RoomsEntity> {
    delete roomsDto.createdAt;
    delete roomsDto.updatedAt;
    return await this.roomsRepository.save({ ...roomsDto });
  }

  async roomsUpdate(roomsDto: RoomsDto): Promise<RoomsEntity> {
    const { id } = roomsDto;
    if (id === undefined) {
      return;
    }
    return await this.roomsCreate(roomsDto);
  }

  async roomsRemove(id: number): Promise<boolean> {
    const result = await this.roomsRepository.delete({ id });
    return !!result?.affected;
  }
}
