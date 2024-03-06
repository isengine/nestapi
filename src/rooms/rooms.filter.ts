import { ObjectType } from '@nestjs/graphql';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { FilterType } from '@src/typeorm/type/filter.type';

@ObjectType()
export class RoomsFilter extends FilterType(RoomsEntity) {}
