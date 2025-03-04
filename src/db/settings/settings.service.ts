import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { SettingsDto } from './settings.dto';
import { SettingsEntity } from './settings.entity';

@Injectable()
export class SettingsService extends CommonService<
  SettingsDto,
  SettingsEntity
> {
  constructor(
    @InjectRepository(SettingsEntity)
    protected readonly repository: Repository<SettingsEntity>,
  ) {
    super();
  }
}
