import { Controller } from '@nestjs/common';
import { ClosedController } from '@src/common/controller/closed.controller';
import { SettingsGroupsDto } from './settings_groups.dto';
import { SettingsGroupsEntity } from './settings_groups.entity';
import { SettingsGroupsService } from './settings_groups.service';

@Controller('settings/groups')
export class SettingsGroupsController extends ClosedController(
  'Группы настроек',
  SettingsGroupsDto,
  SettingsGroupsEntity,
)<SettingsGroupsDto, SettingsGroupsEntity, SettingsGroupsService> {
  constructor(readonly service: SettingsGroupsService) {
    super();
  }
}
