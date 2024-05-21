import { ObjectType } from '@nestjs/graphql';
import { SettingsGroupsEntity } from '@src/settings_groups/settings_groups.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class SettingsGroupsFilter extends FilterType(SettingsGroupsEntity) {}
