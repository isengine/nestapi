import { Resolver } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/common.resolver';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { RoomsFilter } from '@src/rooms/rooms.filter';
import { RoomsService } from '@src/rooms/rooms.service';

@Resolver(RoomsEntity)
export class RoomsResolver extends CommonResolver(
  'rooms',
  RoomsEntity,
  RoomsDto,
  RoomsFilter,
)<
  RoomsService,
  RoomsEntity,
  RoomsDto,
  RoomsFilter
> {
  constructor(
    readonly service: RoomsService,
  ) {
    super();
  }
}
