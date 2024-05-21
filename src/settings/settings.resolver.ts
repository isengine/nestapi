import { Resolver } from '@nestjs/graphql';
import { SettingsDto } from '@src/settings/settings.dto';
import { SettingsEntity } from '@src/settings/settings.entity';
import { SettingsFilter } from '@src/settings/settings.filter';
import { SettingsService } from '@src/settings/settings.service';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';

@Resolver(SettingsEntity)
export class SettingsResolver extends ClosedResolver(
  'settings',
  SettingsEntity,
  SettingsDto,
  SettingsFilter,
)<
  SettingsService,
  SettingsEntity,
  SettingsDto,
  SettingsFilter
> {
  constructor(
    readonly service: SettingsService,
  ) {
    super();
  }
}
