import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';

@ObjectType()
@Entity({ name: 'tokens' })
export class TokensEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    name: 'access_token',
  })
  accessToken: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    name: 'refresh_token',
  })
  refreshToken: string;

  @ManyToOne(() => AuthEntity, (auth) => auth.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;
}
