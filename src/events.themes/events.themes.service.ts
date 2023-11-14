import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsThemesDto } from '@src/events.themes/events.themes.dto';
import { EventsThemesEntity } from '@src/events.themes/events.themes.entity';
import { EventsThemesFilter } from '@src/events.themes/events.themes.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/services/common.service';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';

const relations = ['events'];

@Injectable()
export class EventsThemesService {
  constructor(
    @InjectRepository(EventsThemesEntity)
    private readonly eventsThemesRepository: Repository<EventsThemesEntity>,
  ) {}

  async eventsThemesGetAll(): Promise<EventsThemesEntity[]> {
    return await this.eventsThemesRepository.find({
      relations,
    });
  }

  async eventsThemesGetOne(id: number): Promise<EventsThemesEntity> {
    return await this.eventsThemesRepository.findOne({
      relations,
      where: { id },
    });
  }

  async eventsThemesGetMany(
    getMany: GetManyDto,
  ): Promise<EventsThemesEntity[]> {
    const { ids } = getMany;
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.eventsThemesRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async eventsThemesFilter(
    eventsThemesDto: EventsThemesDto,
    optionsDto: OptionsDto,
  ): Promise<EventsThemesFilter[]> {
    const { root } = commonEntityGetParams(EventsThemesEntity);
    const query = this.eventsThemesRepository.createQueryBuilder(root);
    const where = filterService(eventsThemesDto, root);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async eventsThemesSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
  ): Promise<EventsThemesFilter[]> {
    const { root, core } = commonEntityGetParams(EventsThemesEntity);
    const query = this.eventsThemesRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async eventsThemesCreate(
    eventsThemesDto: EventsThemesDto,
  ): Promise<EventsThemesEntity> {
    delete eventsThemesDto.createdAt;
    delete eventsThemesDto.updatedAt;
    return await this.eventsThemesRepository.save({ ...eventsThemesDto });
  }

  async eventsThemesUpdate(
    eventsThemesDto: EventsThemesDto,
  ): Promise<EventsThemesEntity> {
    const { id } = eventsThemesDto;
    if (id === undefined) {
      return;
    }
    await this.eventsThemesCreate(eventsThemesDto);
    return await this.eventsThemesGetOne(eventsThemesDto.id);
  }

  async eventsThemesRemove(id: number): Promise<boolean> {
    const result = await this.eventsThemesRepository.delete({ id });
    return !!result?.affected;
  }
}
