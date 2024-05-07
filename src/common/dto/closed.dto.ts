import { InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';

@InputType()
export class ClosedDto extends CommonDto  {}
