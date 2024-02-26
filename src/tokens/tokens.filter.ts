import { ObjectType } from '@nestjs/graphql';
import { TokensEntity } from '@src/tokens/tokens.entity';
import { FilterType } from '@src/typeorm/types/filter.type';

@ObjectType()
export class TokensFilter extends FilterType(TokensEntity) {}
