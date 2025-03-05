import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { DtoColumn } from '@src/common/common.column';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { SettingsDto } from '../settings.dto';

@InputType()
export class SettingsGroupsDto extends ClosedDto {
  @DtoColumn('Имя группы')
  name?: string;

  @DtoColumn('Описание или комментарий')
  description?: string;

  @DtoColumn('Позиция для ручной сортировки')
  position?: number;

  @DtoColumn('Флаг, который показывает, выключена или нет эта группа')
  isDisabled?: boolean;

  @ApiProperty({
    required: false,
    description: 'Данные настроек, входящих в группу',
    type: () => [SettingsDto],
  })
  @Field(() => [SettingsDto], { nullable: true })
  settings?: SettingsDto[];
}
