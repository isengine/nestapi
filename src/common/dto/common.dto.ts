import { ID, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CommonDto {
  @ApiProperty({
    required: true,
    description: 'Id номер записи, автоматическое приращение',
  })
  @Field(() => ID, { nullable: true })
  id?: number;

  @ApiProperty({
    required: false,
    description: 'Дата и время создания записи, назначается автоматически',
  })
  @Field({ nullable: true })
  createdAt?: Date;

  @ApiProperty({
    required: false,
    description: 'Дата и время последнего обновления записи, назначается автоматически',
  })
  @Field({ nullable: true })
  updatedAt?: Date;
}
