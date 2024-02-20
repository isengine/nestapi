import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { RoomsFilter } from '@src/rooms/rooms.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
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
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RoomsEntity[]> {
    return await this.roomsRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async roomsGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RoomsEntity> {
    return await this.roomsRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async roomsGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RoomsEntity[]> {
    return await this.roomsRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async roomsFilter(
    roomsDto: RoomsDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RoomsFilter[]> {
    const { root } = commonEntityGetParams(RoomsEntity);
    const query = this.roomsRepository.createQueryBuilder(root);
    const where = filterService(roomsDto, root);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async roomsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<RoomsFilter[]> {
    const { root, core } = commonEntityGetParams(RoomsEntity);
    const query = this.roomsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
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
