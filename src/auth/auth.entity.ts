import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';

@ObjectType()
@Entity({ name: 'auth' })
export class AuthEntity extends CommonEntity {
  @Field()
  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
  })
  login: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'passport_strategy' })
  passportStrategy: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'passport_id' })
  passportId: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  locale: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  rights: string;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_activated' })
  isActivated: boolean;

  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;
}
