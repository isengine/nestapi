import { Resolver } from '@nestjs/graphql';
import { SettingsGroupsDto } from '@src/settings_groups/settings_groups.dto';
import { SettingsGroupsEntity } from '@src/settings_groups/settings_groups.entity';
import { SettingsGroupsFilter } from '@src/settings_groups/settings_groups.filter';
import { SettingsGroupsService } from '@src/settings_groups/settings_groups.service';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';

@Resolver(SettingsGroupsEntity)
export class SettingsGroupsResolver extends ClosedResolver(
  'settingsGroups',
  SettingsGroupsEntity,
  SettingsGroupsDto,
  SettingsGroupsFilter,
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
