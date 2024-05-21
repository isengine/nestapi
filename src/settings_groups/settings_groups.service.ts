import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsGroupsDto } from '@src/settings_groups/settings_groups.dto';
import { SettingsGroupsEntity } from '@src/settings_groups/settings_groups.entity';
import { SettingsGroupsFilter } from '@src/settings_groups/settings_groups.filter';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class SettingsGroupsService extends CommonService<
  SettingsGroupsEntity,
  SettingsGroupsDto,
  SettingsGroupsFilter
> {
  constructor(
    @InjectRepository(SettingsGroupsEntity)
    protected readonly repository: Repository<SettingsGroupsEntity>,
  ) {
    super();
  }
}
