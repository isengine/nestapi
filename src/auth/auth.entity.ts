import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { TokensEntity } from '@src/tokens/tokens.entity';
import { StrategiesEntity } from '@src/strategies/strategies.entity';

@ObjectType()
@Entity({ name: 'auth' })
export class AuthEntity extends CommonEntity {
  @Field()
  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
  })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_activated' })
  isActivated: boolean;

  @Field({ nullable: true })
  tokens: TokensEntity;

  @OneToMany(() => SessionsEntity, (session) => session.auth, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sessions: SessionsEntity[];

  @OneToMany(() => StrategiesEntity, (strategy) => strategy.auth, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  strategies: StrategiesEntity[];
}
