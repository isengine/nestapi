import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { TokensEntity } from '@src/tokens/tokens.entity';

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

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'passport_strategy' })
  passportStrategy: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'passport_id' })
  passportId: string;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_activated' })
  isActivated: boolean;

  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;

  @OneToMany(() => SessionsEntity, (session) => session.auth, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sessions: SessionsEntity[];

  @OneToMany(() => TokensEntity, (token) => token.auth, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tokens: TokensEntity[];
}
