import { Controller } from '@nestjs/common';
import { SettingsGroupsService } from '@src/settings_groups/settings_groups.service';
import { SettingsGroupsDto } from '@src/settings_groups/settings_groups.dto';
import { ClosedController } from '@src/common/controller/closed.controller';
import { SettingsGroupsEntity } from '@src/settings_groups/settings_groups.entity';
import { SettingsGroupsFilter } from '@src/settings_groups/settings_groups.filter';

@Controller('settings_groups')
export class SettingsGroupsController extends ClosedController(
  'Группы настроек',
  SettingsGroupsEntity,
  SettingsGroupsDto,
)<
  SettingsGroupsService,
  SettingsGroupsEntity,
  SettingsGroupsDto,
  SettingsGroupsFilter
> {
  constructor(
    readonly service: SettingsGroupsService,
  ) {
    super();
  }
}
