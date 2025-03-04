import { Resolver } from '@nestjs/graphql';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';
import { SettingsGroupsDto } from './settings_groups.dto';
import { SettingsGroupsEntity } from './settings_groups.entity';
import { SettingsGroupsService } from './settings_groups.service';

@Resolver(SettingsGroupsEntity)
export class SettingsGroupsResolver extends ClosedResolver(
  'settingsGroups',
  SettingsGroupsDto,
  SettingsGroupsEntity,
)<SettingsGroupsDto, SettingsGroupsEntity, SettingsGroupsService> {
  constructor(readonly service: SettingsGroupsService) {
    super();
  }
}
