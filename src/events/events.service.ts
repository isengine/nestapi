import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsDto } from '@src/events/events.dto';
import { EventsEntity } from '@src/events/events.entity';
import { EventsFilter } from '@src/events/events.filter';
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
import { EventsThemesService } from '@src/events.themes/events.themes.service';

const relations = [];
// const relations = ['themes'];

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsEntity)
    private readonly eventsRepository: Repository<EventsEntity>,
    private readonly eventsThemesService: EventsThemesService,
  ) {}

  async eventsGetAll(): Promise<EventsEntity[]> {
    return await this.eventsRepository.find({
      relations,
    });
  }

  async eventsGetOne(id: number): Promise<EventsEntity> {
    return await this.eventsRepository.findOne({
      relations,
      where: { id },
    });
  }

  async eventsGetMany(getMany: GetManyDto): Promise<EventsEntity[]> {
    const { ids } = getMany;
    const idsList = JSON.parse(JSON.stringify(ids).replace(/"/gu, ''));
    return await this.eventsRepository.find({
      relations,
      where: { id: In(idsList) },
    });
  }

  async eventsFilter(
    eventsDto: EventsDto,
    optionsDto: OptionsDto,
  ): Promise<EventsFilter[]> {
    const { root } = commonEntityGetParams(EventsEntity);
    const query = this.eventsRepository.createQueryBuilder(root);
    const where = filterService(eventsDto, root);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async eventsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
  ): Promise<EventsFilter[]> {
    const { root, core } = commonEntityGetParams(EventsEntity);
    const query = this.eventsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core);
    query.where(where);
    commonRelationsCreate(query, relations, root);
    return await optionsService(query, optionsDto, root);
  }

  async eventsCreate(eventsDto: EventsDto): Promise<EventsEntity> {
    const { themeId } = eventsDto;
    if (themeId) {
      const theme = await this.eventsThemesService.eventsThemesGetOne(themeId);
      eventsDto.theme = theme;
    }
    delete eventsDto.themeId;
    delete eventsDto.createdAt;
    delete eventsDto.updatedAt;
    return await this.eventsRepository.save({ ...eventsDto });
  }

  async eventsUpdate(eventsDto: EventsDto): Promise<EventsEntity> {
    const { id } = eventsDto;
    if (id === undefined) {
      return;
    }
    await this.eventsCreate(eventsDto);
    return await this.eventsGetOne(eventsDto.id);
  }

  async eventsRemove(id: number): Promise<boolean> {
    const result = await this.eventsRepository.delete({ id });
    return !!result?.affected;
  }
}
