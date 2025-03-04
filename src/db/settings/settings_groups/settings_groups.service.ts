import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { SettingsGroupsDto } from './settings_groups.dto';
import { SettingsGroupsEntity } from './settings_groups.entity';

@Injectable()
export class SettingsGroupsService extends CommonService<
  SettingsGroupsDto,
  SettingsGroupsEntity
> {
  constructor(
    @InjectRepository(SettingsGroupsEntity)
    protected readonly repository: Repository<SettingsGroupsEntity>,
  ) {
    super();
  }
}
