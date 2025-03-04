import { Resolver } from '@nestjs/graphql';
import { ClosedResolver } from '@src/common/resolver/closed.resolver';
import { SettingsDto } from './settings.dto';
import { SettingsEntity } from './settings.entity';
import { SettingsService } from './settings.service';

@Resolver(SettingsEntity)
export class SettingsResolver extends ClosedResolver(
  'settings',
  SettingsDto,
  SettingsEntity,
)<SettingsDto, SettingsEntity, SettingsService> {
  constructor(readonly service: SettingsService) {
    super();
  }
}
