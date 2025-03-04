import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
// import { IsEnum, NotEquals } from 'class-validator';
import { PrivateDto } from '@src/common/dto/private.dto';
import { TypeGenders } from '@src/common/common.enum';

@InputType()
export class PersonsDto extends PrivateDto {
  @ApiProperty({
    required: false,
    description: 'Дата и время создания записи, назначается автоматически',
  })
  @Field({ nullable: true })
  createdAt?: Date;

  @ApiProperty({
    required: false,
    description:
      'Дата и время последнего обновления записи, назначается автоматически',
  })
  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  @IsEmail()
  @ApiProperty({
    required: false,
    description: 'Имя пользователя, обычно здесь используется email',
  })
  username?: string;

  @Field({ nullable: true })
  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Пароль, заданный пользователем',
  })
  password?: string;

  @ApiProperty({
    required: false,
    description: 'Контактный email, не обязательно совпадает с логином',
  })
  @Field({ nullable: true })
  email?: string;

  @ApiProperty({
    required: false,
    description: 'Контактный телефон',
  })
  @Field({ nullable: true })
  phone?: string;

  @ApiProperty({
    required: false,
    description: 'Имя',
  })
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Фамилия',
  })
  @Field({ nullable: true })
  lastName?: string;

  @ApiProperty({
    required: false,
    description: 'Отчество',
  })
  @Field({ nullable: true })
  parentName?: string;

  @ApiProperty({
    required: false,
    description: 'Ссылка на аватарку',
  })
  @Field({ nullable: true })
  avatar?: string;

  @ApiProperty({
    required: false,
    description: 'Дата рождения',
  })
  @Field({ nullable: true })
  birthday?: Date;

  @ApiProperty({
    required: false,
    description: 'Предпочитаемый язык',
  })
  @Field({ nullable: true })
  locale?: string;

  @ApiProperty({
    required: false,
    description: 'Адрес',
  })
  @Field({ nullable: true })
  address?: string;

  @ApiProperty({
    required: false,
    description: 'Временна зона в формате +/-00:00',
  })
  @Field({ nullable: true })
  timezone?: string;

  @ApiProperty({
    required: false,
    description: 'Пол',
  })
  @Field(() => TypeGenders, {
    nullable: true,
    defaultValue: TypeGenders.DEFAULT,
  })
  // @IsEnum(TypeGenders)
  // @NotEquals(TypeGenders[TypeGenders.DEFAULT])
  gender?: TypeGenders;
}
