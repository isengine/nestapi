import { Resolver } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/common.resolver';
import { RoomsDto } from './rooms.dto';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Resolver(RoomsEntity)
export class RoomsResolver extends CommonResolver(
  'rooms',
  RoomsDto,
  RoomsEntity,
)<RoomsDto, RoomsEntity, RoomsService> {
  constructor(readonly service: RoomsService) {
    super();
  }
}
