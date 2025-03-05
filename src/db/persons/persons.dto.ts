import { InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  DtoColumn,
  DtoCreatedColumn,
  DtoEnumColumn,
  DtoUpdatedColumn,
} from '@src/common/common.column';
import { PrivateDto } from '@src/common/dto/private.dto';
import { TypeGenders } from '@src/common/common.enum';

@InputType()
export class PersonsDto extends PrivateDto {
  @DtoCreatedColumn()
  createdAt?: Date;

  @DtoUpdatedColumn()
  updatedAt?: Date;

  @IsEmail()
  @DtoColumn('Имя пользователя, обычно здесь используется email')
  username?: string;

  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  @DtoColumn('Пароль, заданный пользователем')
  password?: string;

  @DtoColumn('Контактный email, не обязательно совпадает с логином')
  email?: string;

  @DtoColumn('Контактный телефон')
  phone?: string;

  @DtoColumn('Имя')
  name?: string;

  @DtoColumn('Фамилия')
  lastName?: string;

  @DtoColumn('Отчество')
  parentName?: string;

  @DtoColumn('Ссылка на аватарку')
  avatar?: string;

  @DtoColumn('Дата рождения')
  birthday?: Date;

  @DtoColumn('Предпочитаемый язык')
  locale?: string;

  @DtoColumn('Адрес')
  address?: string;

  @DtoColumn('Временна зона в формате +/-00:00')
  timezone?: string;

  @DtoEnumColumn('Пол', TypeGenders, TypeGenders.DEFAULT)
  gender?: TypeGenders;
}
