import { Controller } from '@nestjs/common';
import { SettingsService } from '@src/settings/settings.service';
import { SettingsDto } from '@src/settings/settings.dto';
import { ClosedController } from '@src/common/controller/closed.controller';
import { SettingsEntity } from '@src/settings/settings.entity';
import { SettingsFilter } from '@src/settings/settings.filter';

@Controller('settings')
export class SettingsController extends ClosedController(
  'Настройки',
  SettingsEntity,
  SettingsDto,
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
